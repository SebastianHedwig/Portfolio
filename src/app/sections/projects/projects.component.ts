import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initScrollReveals } from '../../shared/animations/scroll-reveal';
import { type ScrollRevealConfig } from '../../shared/animations/scroll-reveal-config';
import { scheduleScrollTriggerRefresh } from '../../shared/animations/scroll-trigger-refresh';
import { LanguageStore } from '../../i18n/language.store';
import {
  ProjectsStageEntryComponent,
  PROJECTS_STAGE_ENTRY_REVEALS,
} from './components/projects-stage-entry/projects-stage-entry.component';
import { ProjectsStageItemComponent } from './components/projects-stage-item/projects-stage-item.component';
import { type ProjectStageItemData } from './projects.models';
import { getProjectsContent } from './projects.data';

gsap.registerPlugin(ScrollTrigger);

const TABLET_LANDSCAPE_QUERY =
  '(min-width: 1024px) and (max-width: 1368px) and (orientation: landscape) and (min-height: 768px) and (max-height: 1024px)';
const TABLET_PORTRAIT_QUERY =
  '(min-width: 768px) and (max-width: 1024px) and (orientation: portrait) and (min-height: 900px)';
const PROJECTS_SCROLL_START = 'top bottom+=46%';
const PROJECTS_SCROLL_START_TABLET_LANDSCAPE = 'top bottom+=24%';

interface ProjectsAnimationElements {
  projectPanels: HTMLElement[];
  scrollSpace: HTMLElement;
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
  readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly languageStore = inject(LanguageStore);
  private animationContext: gsap.Context | null = null;
  private projectsTimeline: gsap.core.Timeline | null = null;
  private hasInitializedLanguage = false;

  readonly content = computed(() => getProjectsContent(this.languageStore.language()));
  readonly projects = computed<readonly ProjectStageItemData[]>(() => this.content().items);

  constructor() {
    afterNextRender(() => this.initAnimation());
    effect((onCleanup) => {
      this.languageStore.language();

      if (!this.hasInitializedLanguage) {
        this.hasInitializedLanguage = true;
        return;
      }

      const preservedProgress = this.getActiveProjectsProgress();
      if (preservedProgress === null) {
        return;
      }

      const refreshFrameId = requestAnimationFrame(() => {
        scheduleScrollTriggerRefresh(() => this.restoreProjectsProgress(preservedProgress));
      });

      onCleanup(() => cancelAnimationFrame(refreshFrameId));
    });
  }

  ngOnDestroy(): void {
    this.animationContext?.revert();
    this.animationContext = null;
    this.projectsTimeline = null;
  }

  private initAnimation(): void {
    if (this.isTabletPortrait()) {
      this.animationContext?.revert();
      this.animationContext = null;
      this.projectsTimeline = null;
      this.initProjectEntryReveals();
      return;
    }

    const elements = this.getAnimationElements();
    if (!elements) return;

    this.animationContext?.revert();
    this.animationContext = gsap.context(
      () => this.buildAnimation(elements),
      this.host.nativeElement,
    );
  }

  private getAnimationElements(): ProjectsAnimationElements | null {
    const viewport = this.viewport().nativeElement;
    const projectPanels = Array.from(viewport.querySelectorAll<HTMLElement>('app-projects-stage-item'));
    if (projectPanels.length !== this.projects().length) return null;

    return {
      scrollSpace: this.scrollSpace().nativeElement,
      projectPanels,
    };
  }

  private buildAnimation(elements: ProjectsAnimationElements): void {
    this.setInitialPanelState(elements.projectPanels);
    this.buildTimeline(elements);
    this.initProjectEntryReveals();
  }

  private setInitialPanelState(projectPanels: HTMLElement[]): void {
    gsap.set(projectPanels, { xPercent: 110, scale: 0.6, autoAlpha: 0.08 });
  }

  private buildTimeline(elements: ProjectsAnimationElements): void {
    const timeline = this.createTimeline(elements.scrollSpace);
    this.projectsTimeline = timeline;

    this.addProjectsEnter(timeline, elements.projectPanels[0]);
    this.addPanelTransitions(timeline, elements.projectPanels);
  }

  private createTimeline(scrollSpace: HTMLElement): gsap.core.Timeline {
    return gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scrollSpace,
        start: () => this.getProjectsScrollStart(),
        endTrigger: scrollSpace,
        end: 'bottom',
        scrub: 1.25,
        invalidateOnRefresh: true,
      },
    });
  }

  private getProjectsScrollStart(): string {
    if (window.matchMedia(TABLET_LANDSCAPE_QUERY).matches) {
      return PROJECTS_SCROLL_START_TABLET_LANDSCAPE;
    }

    return PROJECTS_SCROLL_START;
  }

  private isTabletPortrait(): boolean {
    return window.matchMedia(TABLET_PORTRAIT_QUERY).matches;
  }

  private addProjectsEnter(timeline: gsap.core.Timeline, firstPanel: HTMLElement): void {
    timeline.addLabel('projects-enter').to(firstPanel, {
      xPercent: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 1.25,
    });
  }

  private addPanelTransitions(
    timeline: gsap.core.Timeline,
    projectPanels: readonly HTMLElement[],
  ): void {
    projectPanels.forEach((panel, index) => {
      const nextPanel = projectPanels[index + 1];
      if (!nextPanel) return this.addProjectsExit(timeline, panel);

      this.addPanelTransition(timeline, panel, nextPanel, index);
    });
  }

  private addPanelTransition(
    timeline: gsap.core.Timeline,
    panel: HTMLElement,
    nextPanel: HTMLElement,
    index: number,
  ): void {
    const label = `stage-${index + 1}-transition`;
    const duration = index === 1 ? 0.82 : 1.08;

    timeline.addLabel(label);
    this.addPanelExit(timeline, panel, label, duration);
    this.addPanelEnter(timeline, nextPanel, label, duration);
  }

  private addPanelExit(
    timeline: gsap.core.Timeline,
    panel: HTMLElement,
    label: string,
    duration: number,
  ): void {
    timeline.to(panel, {
      xPercent: -112,
      scale: 0.6,
      autoAlpha: 0.08,
      duration,
    }, label);
  }

  private addPanelEnter(
    timeline: gsap.core.Timeline,
    panel: HTMLElement,
    label: string,
    duration: number,
  ): void {
    timeline.to(panel, {
      xPercent: 0,
      scale: 1,
      autoAlpha: 1,
      duration,
    }, label);
  }

  private addProjectsExit(timeline: gsap.core.Timeline, panel: HTMLElement): void {
    timeline.addLabel('projects-exit').to(panel, {
      xPercent: -112,
      scale: 0.6,
      autoAlpha: 0.04,
      duration: 1.02,
    });
  }

  private initProjectEntryReveals(): void {
    initScrollReveals(
      this.host.nativeElement,
      PROJECTS_STAGE_ENTRY_REVEALS as readonly ScrollRevealConfig[],
    );
  }

  private getActiveProjectsProgress(): number | null {
    const progress = this.projectsTimeline?.scrollTrigger?.progress;

    if (progress === undefined || progress <= 0 || progress >= 1) {
      return null;
    }

    return progress;
  }

  private restoreProjectsProgress(progress: number): void {
    const scrollTrigger = this.projectsTimeline?.scrollTrigger;
    if (!scrollTrigger) {
      return;
    }

    const nextScrollTop = scrollTrigger.start + progress * (scrollTrigger.end - scrollTrigger.start);

    window.scrollTo({ top: nextScrollTop, behavior: 'auto' });
    ScrollTrigger.update();
  }
}
