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

import { ProjectsStageEntryComponent } from './components/projects-stage-entry/projects-stage-entry.component';
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
  imports: [ProjectsStageEntryComponent, ProjectsStageItemComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnDestroy {
  readonly scrollSpace = viewChild.required<ElementRef<HTMLElement>>('scrollSpace');
  readonly entryPause = 0.5;
  readonly centerPause = 0.5;
  readonly exitPause = 0.5;
  readonly entryEyebrow = 'Selected Work';
  readonly entryTitleLines = [
    'Drei Arbeiten, die zeigen,',
    'wie aus Struktur,',
    'Haltung und Praezision',
    'digitale Erlebnisse entstehen.',
  ] as const;
  readonly entryLead = 'Kein Katalog. Kein Raster. Nur drei fokussierte Momente, die jeweils einen anderen Teil meiner Arbeitsweise sichtbar machen.';

  readonly projects: readonly ProjectStageItemData[] = PROJECTS_STAGE_ITEMS;

  readonly centerPauseCount = this.projects.length - 1;
  readonly pauseUnits =
    this.entryPause + this.exitPause + this.centerPause * this.centerPauseCount;
  readonly sceneCount = this.projects.length + 1 + this.pauseUnits;
  private frameId: number | null = null;
  private readonly targetProgress = signal(0);
  private readonly progress = signal(0);

  readonly entryState = computed(() => this.createSceneState(0));
  readonly projectPanels = computed(() => this.createProjectPanels());

  constructor() {
    afterNextRender(() => this.updateTargetProgress());
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

  private updateTargetProgress(): void {
    const rect = this.scrollSpace().nativeElement.getBoundingClientRect();
    this.targetProgress.set(this.normalizeProgress(rect));
    this.startProgressLoop();
  }

  private normalizeProgress(rect: DOMRect): number {
    const travelled = -rect.top;
    const units = this.getScrollUnits(travelled, rect);
    return this.mapUnitsToProgress(units);
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
    const delta = anchor - this.progress();
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

  private mapUnitsToProgress(units: number): number {
    let start = 0;
    for (let index = 0; index < this.projects.length; index += 1) {
      const end = start + this.getTransitionSpan(index);
      if (units <= end) return this.getEasedProgress(units, start, end, index);
      start = end;
    }
    return this.projects.length;
  }

  private getTransitionSpan(index: number): number {
    if (index === 0) return 1 + this.entryPause;
    if (index === this.projects.length - 1) {
      return 1 + this.centerPause + this.exitPause;
    }
    return 1 + this.centerPause;
  }

  private getEasedProgress(
    units: number,
    start: number,
    end: number,
    index: number,
  ): number {
    const span = end - start;
    const raw = this.clamp((units - start) / span, 0, 1);
    return index + this.easeHold(raw);
  }

  private getTotalDistance(rect: DOMRect): number {
    return Math.max(rect.height - window.innerHeight, 1);
  }

  private getTotalUnits(): number {
    return this.projects.length + this.pauseUnits;
  }

  private easeHold(value: number): number {
    return this.easeInOut(this.easeInOut(value));
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
    this.progress.set(next);
    this.hasProgressSettled(next) ? this.stopProgressLoop() : this.queueNextTick();
  }

  private getNextProgress(): number {
    const current = this.progress();
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
