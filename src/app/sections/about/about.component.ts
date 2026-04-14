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
import { scheduleScrollTriggerRefresh } from '../../shared/animations/scroll-trigger-refresh';

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

interface AboutAnimationElements {
  contextChapter: HTMLElement;
  introChapter: HTMLElement;
  scrollSpace: HTMLElement;
  section: HTMLElement;
}

const ABOUT_BASE_VIEWPORT_HEIGHT = 1080;

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
    const elements = this.getAnimationElements();

    this.animationContext?.revert();
    this.animationContext = gsap.context(
      () => this.buildAnimation(elements),
      this.host.nativeElement,
    );
    scheduleScrollTriggerRefresh();
  }

  private getAnimationElements(): AboutAnimationElements {
    return {
      section: this.host.nativeElement,
      scrollSpace: this.scrollSpace().nativeElement,
      introChapter: this.introChapter().nativeElement,
      contextChapter: this.contextChapter().nativeElement,
    };
  }

  private buildAnimation(elements: AboutAnimationElements): void {
    this.setInitialChapterState(elements);
    this.buildTimeline(elements);
  }

  private setInitialChapterState(elements: AboutAnimationElements): void {
    gsap.set(elements.introChapter, { xPercent: -132, scale: 0.92, autoAlpha: 0.08 });
    gsap.set(elements.contextChapter, { xPercent: -132, scale: 0.6, autoAlpha: 0.08 });
  }

  private buildTimeline(elements: AboutAnimationElements): void {
    const timeline = this.createTimeline(elements);

    this.addIntroEnter(timeline, elements.introChapter);
    this.addContextTransition(timeline, elements);
    this.addAboutExit(timeline, elements.contextChapter);
  }

  private createTimeline(elements: AboutAnimationElements): gsap.core.Timeline {
    return gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: elements.section,
        start: this.getEntryStart(),
        endTrigger: elements.scrollSpace,
        end: 'bottom top-=20%',
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });
  }

  private addIntroEnter(timeline: gsap.core.Timeline, introChapter: HTMLElement): void {
    timeline.addLabel('intro-enter').to(introChapter, {
      xPercent: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 0.72,
    });
  }

  private addContextTransition(
    timeline: gsap.core.Timeline,
    elements: AboutAnimationElements,
  ): void {
    timeline.addLabel('context-enter');
    this.addIntroExitForContext(timeline, elements.introChapter);
    this.addContextEnter(timeline, elements.contextChapter);
  }

  private addIntroExitForContext(
    timeline: gsap.core.Timeline,
    introChapter: HTMLElement,
  ): void {
    timeline.to(introChapter, {
      xPercent: 124,
      scale: 0.6,
      autoAlpha: 0.08,
      duration: 0.54,
    }, 'context-enter');
  }

  private addContextEnter(
    timeline: gsap.core.Timeline,
    contextChapter: HTMLElement,
  ): void {
    timeline.to(contextChapter, {
      xPercent: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 0.54,
    }, 'context-enter');
  }

  private addAboutExit(timeline: gsap.core.Timeline, contextChapter: HTMLElement): void {
    timeline.addLabel('about-exit').to(contextChapter, {
      xPercent: 112,
      scale: 0.6,
      autoAlpha: 0.04,
      duration: 0.48,
    });
  }

  private getEntryStart(): string {
    return `top bottom+=${this.getEntryOffsetPercent()}%`;
  }

  private getEntryOffsetPercent(): number {
    const offsetPercent =
      ((ABOUT_BASE_VIEWPORT_HEIGHT * 1.8) / window.innerHeight) * 100;
    return this.roundToTenth(Math.min(100, offsetPercent));
  }

  private roundToTenth(value: number): number {
    return Math.round(value * 10) / 10;
  }
}
