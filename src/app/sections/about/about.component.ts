import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScrollReveals } from '../../shared/animations/scroll-reveal';
import { type ScrollRevealConfig } from '../../shared/animations/scroll-reveal-config';
import { scheduleScrollTriggerRefresh } from '../../shared/animations/scroll-trigger-refresh';
import { LanguageStore } from '../../i18n/language.store';

import { getAboutContent } from './about.data';
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
const TABLET_PORTRAIT_QUERY =
  '(min-width: 768px) and (max-width: 1024px) and (orientation: portrait) and (min-height: 900px)';
const ABOUT_TABLET_PORTRAIT_REVEALS: readonly ScrollRevealConfig[] = [
  {
    selector: '.about-stage__text-zone--lead',
    start: 'top 110%',
    end: 'top 68%',
  },
  {
    selector: 'app-about-image',
    start: 'top 96%',
    end: 'top 60%',
  },
  {
    selector: '.about-stage__text-zone--secondary',
    start: 'top 110%',
    end: 'top 68%',
  },
  {
    selector: '.about-stage__context-block--left',
    start: 'top 110%',
    end: 'top 68%',
  },
  {
    selector: '.about-stage__context-block--right',
    start: 'top 108%',
    end: 'top 66%',
  },
  {
    selector: '.about-stage__context-block--center',
    start: 'top 108%',
    end: 'top 66%',
  },
] as const;

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

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly languageStore = inject(LanguageStore);
  private animationContext: gsap.Context | null = null;

  readonly content = computed(() => getAboutContent(this.languageStore.language()));
  readonly portrait = computed(() => this.content().portrait);
  readonly introLead = computed(() => this.content().introLead);
  readonly introSecondary = computed(() => this.content().introSecondary);
  readonly contextLeft = computed(() => this.content().contextLeft);
  readonly contextCenter = computed(() => this.content().contextCenter);
  readonly contextRight = computed(() => this.content().contextRight);

  constructor() {
    afterNextRender(() => this.initAnimation());
  }

  ngOnDestroy(): void {
    this.animationContext?.revert();
    this.animationContext = null;
  }

  private initAnimation(): void {
    const elements = this.getAnimationElements();

    if (this.isTabletPortrait()) {
      this.animationContext?.revert();
      this.animationContext = gsap.context(
        () => this.buildTabletPortraitAnimation(elements),
        this.host.nativeElement,
      );
      scheduleScrollTriggerRefresh();
      return;
    }

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

  private buildTabletPortraitAnimation(elements: AboutAnimationElements): void {
    gsap.set([elements.introChapter, elements.contextChapter], {
      clearProps: 'transform,opacity,visibility',
    });
    initScrollReveals(this.host.nativeElement, ABOUT_TABLET_PORTRAIT_REVEALS);
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

  private isTabletPortrait(): boolean {
    return window.matchMedia(TABLET_PORTRAIT_QUERY).matches;
  }
}
