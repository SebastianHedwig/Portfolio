import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  afterNextRender,
  computed,
  signal,
  viewChild,
} from '@angular/core';

import { ProjectsStageItemComponent } from './components/projects-stage-item/projects-stage-item.component';
import {
  type ProjectStageItemData,
  type ProjectStageVisualState,
} from './projects.models';
import { PROJECTS_STAGE_ITEMS } from './projects.data';

interface ProjectStagePanelData {
  project: ProjectStageItemData;
  state: ProjectStageVisualState;
}

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ProjectsStageItemComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnDestroy {
  readonly scrollSpace = viewChild.required<ElementRef<HTMLElement>>('scrollSpace');
  readonly entryPause = 0.5;
  readonly centerPause = 0.5;
  readonly exitPause = 0.5;
  readonly entryEyebrow = 'Selected Work';
  readonly entryTitle = 'Drei Arbeiten, die zeigen, wie aus Struktur, Haltung und Praezision digitale Erlebnisse entstehen.';
  readonly entryLead = 'Kein Katalog. Kein Raster. Nur drei fokussierte Momente, die jeweils einen anderen Teil meiner Arbeitsweise sichtbar machen.';

  readonly projects: readonly ProjectStageItemData[] = PROJECTS_STAGE_ITEMS;

  readonly centerPauseCount = this.projects.length - 1;
  readonly pauseUnits =
    this.entryPause + this.exitPause + this.centerPause * this.centerPauseCount;
  readonly sceneCount = this.projects.length + 1 + this.pauseUnits;
  private frameId: number | null = null;
  private readonly targetProgress = signal(0);
  private readonly stageProgress = signal(0);

  readonly entryState = computed(() => this.createSceneState(0));
  readonly projectPanels = computed(() => this.createProjectPanels());

  constructor() {
    afterNextRender(() => this.initializeProgress());
  }

  ngOnDestroy(): void {
    this.stopProgressLoop();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateTargetProgress();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateTargetProgress();
  }

  private initializeProgress(): void {
    this.updateTargetProgress();
    this.startProgressLoop();
  }

  private updateTargetProgress(): void {
    const rect = this.scrollSpace().nativeElement.getBoundingClientRect();
    this.targetProgress.set(this.normalizeProgress(rect));
    this.startProgressLoop();
  }

  private normalizeProgress(rect: DOMRect): number {
    const travelled = -rect.top;
    const units = this.getScrollUnits(travelled, rect);
    const progress = this.applyCenterPauses(units);
    return this.smoothEdgeTransitions(progress);
  }

  private getScrollUnits(travelled: number, rect: DOMRect): number {
    const total = this.getTotalDistance(rect);
    const clamped = this.clamp(travelled, 0, total);
    return (clamped / total) * this.getTotalUnits();
  }

  private createProjectPanels(): readonly ProjectStagePanelData[] {
    return this.projects.map((project, index) => ({
      project,
      state: this.createSceneState(index + 1),
    }));
  }

  private createSceneState(anchor: number): ProjectStageVisualState {
    const delta = anchor - this.stageProgress();
    const shift = delta * 112;
    const scale = 1 - this.clamp(Math.abs(delta) * 0.08, 0, 0.18);
    const opacity = this.clamp(1 - Math.abs(delta) * 0.78, 0, 1);
    return {
      opacity: `${opacity}`,
      pointerEvents: opacity > 0.25 ? 'auto' : 'none',
      transform: `translate3d(${shift}vw, 0, 0) scale(${scale})`,
      zIndex: `${Math.round(40 - Math.abs(delta) * 10)}`,
    };
  }

  private applyCenterPauses(units: number): number {
    let progress = units - Math.min(this.entryPause, units);
    for (let anchor = 1; anchor <= this.centerPauseCount; anchor += 1) {
      progress -= this.getPauseOffset(units, anchor);
    }
    return this.clamp(progress, 0, this.projects.length);
  }

  private getPauseOffset(units: number, anchor: number): number {
    const threshold = this.getPauseThreshold(anchor);
    if (units <= threshold) return 0;
    return Math.min(this.centerPause, units - threshold);
  }

  private getPauseThreshold(anchor: number): number {
    return this.entryPause + anchor + this.centerPause * (anchor - 1);
  }

  private getTotalDistance(rect: DOMRect): number {
    return Math.max(rect.height - window.innerHeight, 1);
  }

  private getTotalUnits(): number {
    return this.projects.length + this.pauseUnits;
  }

  private smoothEdgeTransitions(progress: number): number {
    const entrySmoothed = this.smoothEntry(progress);
    return this.smoothExit(entrySmoothed);
  }

  private smoothEntry(progress: number): number {
    if (progress >= 1) return progress;
    return this.easeRange(progress, 0, 1);
  }

  private smoothExit(progress: number): number {
    const start = this.projects.length - 1;
    if (progress <= start) return progress;
    return this.easeRange(progress, start, this.projects.length);
  }

  private easeRange(value: number, start: number, end: number): number {
    const span = end - start;
    const raw = (value - start) / span;
    const eased = this.easeInOut(this.clamp(raw, 0, 1));
    return start + eased * span;
  }

  private easeInOut(value: number): number {
    return value * value * (3 - 2 * value);
  }

  private startProgressLoop(): void {
    if (this.frameId !== null) return;
    this.queueNextTick();
  }

  private tickProgress(): void {
    const next = this.getNextProgress();
    this.stageProgress.set(next);
    this.hasProgressSettled(next) ? this.stopProgressLoop() : this.queueNextTick();
  }

  private getNextProgress(): number {
    const current = this.stageProgress();
    const target = this.targetProgress();
    const next = current + (target - current) * 0.14;
    return this.hasProgressSettled(next) ? target : next;
  }

  private hasProgressSettled(value: number): boolean {
    return Math.abs(this.targetProgress() - value) < 0.001;
  }

  private queueNextTick(): void {
    this.frameId = window.requestAnimationFrame(() => this.tickProgress());
  }

  private stopProgressLoop(): void {
    if (this.frameId === null) return;
    window.cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }

  private clamp(value: number, min = 0, max = 1): number {
    return Math.min(max, Math.max(min, value));
  }
}
