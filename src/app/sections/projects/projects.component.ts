import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initScrollReveals } from '../../shared/animations/scroll-reveal';
import { type ScrollRevealConfig } from '../../shared/animations/scroll-reveal-config';
import {
  ProjectsStageEntryComponent,
  PROJECTS_STAGE_ENTRY_REVEALS,
} from './components/projects-stage-entry/projects-stage-entry.component';
import { ProjectsStageItemComponent } from './components/projects-stage-item/projects-stage-item.component';
import { type ProjectStageItemData } from './projects.models';
import { PROJECTS_STAGE_ITEMS } from './projects.data';

gsap.registerPlugin(ScrollTrigger);

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
  readonly projects: readonly ProjectStageItemData[] = PROJECTS_STAGE_ITEMS;

  private readonly host = inject(ElementRef<HTMLElement>);
  private animationContext: gsap.Context | null = null;

  constructor() {
    afterNextRender(() => this.initAnimation());
  }

  ngOnDestroy(): void {
    this.animationContext?.revert();
    this.animationContext = null;
  }

  private initAnimation(): void {
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
    if (projectPanels.length !== this.projects.length) return null;

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

    this.addProjectsEnter(timeline, elements.projectPanels[0]);
    this.addPanelTransitions(timeline, elements.projectPanels);
  }

  private createTimeline(scrollSpace: HTMLElement): gsap.core.Timeline {
    return gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scrollSpace,
        start: 'top bottom+=46%',
        endTrigger: scrollSpace,
        end: 'bottom',
        scrub: 1.25,
        invalidateOnRefresh: true,
      },
    });
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
}
