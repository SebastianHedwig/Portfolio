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
    const entryPanel = viewport.querySelector<HTMLElement>('app-projects-stage-entry');
    const projectPanels = Array.from(
      viewport.querySelectorAll<HTMLElement>('app-projects-stage-item'),
    );

    if (!entryPanel || projectPanels.length !== this.projects.length) return;

    this.animationContext?.revert();
    this.animationContext = gsap.context(() => {
      const panels = [entryPanel, ...projectPanels];

      gsap.set(panels, {
        xPercent: 110,
        scale: 0.92,
        autoAlpha: 0.08,
      });

      gsap.set(projectPanels, {
        scale: 0.6,
      });

      gsap.set(entryPanel, {
        xPercent: 110,
        scale: 0.92,
        autoAlpha: 0.08,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none',
        },
        scrollTrigger: {
          trigger: this.host.nativeElement,
          start: 'top bottom+=60%',
          endTrigger: scrollSpace,
          end: 'bottom 42%',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .addLabel('entry-enter')
        .to(entryPanel, {
          xPercent: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1.4,
        });

      panels.forEach((panel, index) => {
        const nextPanel = panels[index + 1];

        if (nextPanel) {
          timeline
            .addLabel(`stage-${index + 1}-transition`)
            .to(
              panel,
              {
                xPercent: -112,
                scale: 0.6,
                autoAlpha: 0.08,
                duration: 1.08,
              },
              `stage-${index + 1}-transition`,
            )
            .to(
              nextPanel,
              {
                xPercent: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 1.08,
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
    }, this.host.nativeElement);

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}
