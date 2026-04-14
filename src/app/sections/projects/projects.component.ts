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
import { ProjectsStageEntryComponent } from './components/projects-stage-entry/projects-stage-entry.component';
import { ProjectsStageItemComponent } from './components/projects-stage-item/projects-stage-item.component';
import { type ProjectStageItemData } from './projects.models';
import { PROJECTS_STAGE_ITEMS } from './projects.data';

gsap.registerPlugin(ScrollTrigger);

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
    const scrollSpace = this.scrollSpace().nativeElement;
    const viewport = this.viewport().nativeElement;
    const projectPanels = Array.from(
      viewport.querySelectorAll<HTMLElement>('app-projects-stage-item'),
    );

    if (projectPanels.length !== this.projects.length) return;

    this.animationContext?.revert();
    this.animationContext = gsap.context(() => {
      gsap.set(projectPanels, {
        xPercent: 110,
        scale: 0.6,
        autoAlpha: 0.08,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none',
        },
        scrollTrigger: {
          trigger: scrollSpace,
          start: 'top bottom+=46%',
          endTrigger: scrollSpace,
          end: 'bottom',
          scrub: 1.25,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .addLabel('projects-enter')
        .to(projectPanels[0], {
          xPercent: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1.25,
        });

      projectPanels.forEach((panel, index) => {
        const nextPanel = projectPanels[index + 1];

        if (nextPanel) {
          timeline
            .addLabel(`stage-${index + 1}-transition`)
            .to(
              panel,
              {
                xPercent: -112,
                scale: 0.6,
                autoAlpha: 0.08,
                duration: index === 1 ? 0.82 : 1.08,
              },
              `stage-${index + 1}-transition`,
            )
            .to(
              nextPanel,
              {
                xPercent: 0,
                scale: 1,
                autoAlpha: 1,
                duration: index === 1 ? 0.82 : 1.08,
              },
              `stage-${index + 1}-transition`,
            );
          return;
        }

        timeline
          .addLabel('projects-exit')
          .to(panel, {
            xPercent: -112,
            scale: 0.6,
            autoAlpha: 0.04,
            duration: 1.02,
          });
      });

      initScrollReveals(this.host.nativeElement);
    }, this.host.nativeElement);

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}
