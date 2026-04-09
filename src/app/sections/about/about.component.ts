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

import {
  ABOUT_CONTEXT_CENTER,
  ABOUT_CONTEXT_LEFT,
  ABOUT_CONTEXT_RIGHT,
  ABOUT_INTRO_LEAD,
  ABOUT_INTRO_SECONDARY,
  ABOUT_PORTRAIT,
} from './about.data';
import { AboutImageComponent } from './components/about-image/about-image.component';
import { AboutTextBlockComponent } from './components/about-text-block/about-text-block.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AboutImageComponent, AboutTextBlockComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnDestroy {
  readonly scrollSpace = viewChild.required<ElementRef<HTMLElement>>('scrollSpace');
  readonly introChapter = viewChild.required<ElementRef<HTMLElement>>('introChapter');
  readonly contextChapter = viewChild.required<ElementRef<HTMLElement>>('contextChapter');

  readonly portrait = ABOUT_PORTRAIT;
  readonly introLead = ABOUT_INTRO_LEAD;
  readonly introSecondary = ABOUT_INTRO_SECONDARY;
  readonly contextLeft = ABOUT_CONTEXT_LEFT;
  readonly contextCenter = ABOUT_CONTEXT_CENTER;
  readonly contextRight = ABOUT_CONTEXT_RIGHT;

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
    const section = this.host.nativeElement;
    const scrollSpace = this.scrollSpace().nativeElement;
    const introChapter = this.introChapter().nativeElement;
    const contextChapter = this.contextChapter().nativeElement;

    this.animationContext?.revert();
    this.animationContext = gsap.context(() => {
      gsap.set(introChapter, {
        xPercent: -132,
        scale: 0.92,
        autoAlpha: 0.08,
      });

      gsap.set(contextChapter, {
        xPercent: -132,
        scale: 0.6,
        autoAlpha: 0.08,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none',
        },
        scrollTrigger: {
          trigger: section,
          start: 'top bottom+=150%',
          endTrigger: scrollSpace,
          end: 'bottom top-=20%',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .addLabel('intro-enter')
        .to(introChapter, {
          xPercent: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.72,
        })
        .addLabel('context-enter')
        .to(
          introChapter,
          {
            xPercent: 124,
            scale: 0.6,
            autoAlpha: 0.08,
            duration: 0.54,
          },
          'context-enter',
        )
        .to(
          contextChapter,
          {
            xPercent: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.54,
          },
          'context-enter',
        )
        .addLabel('about-exit')
        .to(contextChapter, {
          xPercent: 112,
          scale: 0.6,
          autoAlpha: 0.04,
          duration: 0.48,
        });
    }, this.host.nativeElement);

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}
