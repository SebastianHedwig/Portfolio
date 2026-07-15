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

const ABOUT_SCROLL_START = 'top bottom+=46%';
const STACKED_STAGE_QUERY = '(max-width: 1024px) and (orientation: portrait)';
const COMPACT_STACKED_STAGE_QUERY = '(max-width: 360px) and (max-height: 520px) and (orientation: portrait)';
const LARGE_DESKTOP_STAGE_QUERY = '(min-width: 1600px) and (orientation: landscape)';
const ABOUT_TABLET_PORTRAIT_REVEALS: readonly ScrollRevealConfig[] = [
  {
    selector: '.about-stage__text-zone--vision',
    start: 'top 110%',
    end: 'top 68%',
  },
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
    selector: '.about-stage__context-bottom-head',
    start: 'top 108%',
    end: 'top 66%',
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

const ABOUT_COMPACT_PORTRAIT_REVEALS: readonly ScrollRevealConfig[] = [
  {
    selector: '.about-stage__text-zone--vision',
    start: 'top 98%',
    end: 'top 56%',
  },
  {
    selector: '.about-stage__text-zone--lead',
    start: 'top 98%',
    end: 'top 56%',
  },
  {
    selector: 'app-about-image',
    start: 'top 90%',
    end: 'top 52%',
  },
  {
    selector: '.about-stage__text-zone--secondary',
    start: 'top 98%',
    end: 'top 56%',
  },
  {
    selector: '.about-stage__context-block--left',
    start: 'top 98%',
    end: 'top 56%',
  },
  {
    selector: '.about-stage__context-bottom-head',
    start: 'top 96%',
    end: 'top 54%',
  },
  {
    selector: '.about-stage__context-block--right',
    start: 'top 96%',
    end: 'top 54%',
  },
  {
    selector: '.about-stage__context-block--center',
    start: 'top 96%',
    end: 'top 54%',
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
  private stackedStageMediaQuery: MediaQueryList | null = null;
  private readonly handleStackedStageChange = (): void => this.initAnimation();

  readonly content = computed(() => getAboutContent(this.languageStore.language()));
  readonly portrait = computed(() => this.content().portrait);
  readonly introLead = computed(() => this.content().introLead);
  readonly introVision = computed(() => this.content().introVision);
  readonly introSecondary = computed(() => this.content().introSecondary);
  readonly contextBottomHead = computed(() => this.content().contextBottomHead);
  readonly contextLeft = computed(() => this.content().contextLeft);
  readonly contextCenter = computed(() => this.content().contextCenter);
  readonly contextRight = computed(() => this.content().contextRight);

  constructor() {
    afterNextRender(() => {
      this.registerStackedStageMediaQuery();
      this.initAnimation();
    });
  }

  ngOnDestroy(): void {
    this.stackedStageMediaQuery?.removeEventListener('change', this.handleStackedStageChange);
    this.stackedStageMediaQuery = null;
    this.animationContext?.revert();
    this.animationContext = null;
  }

  private registerStackedStageMediaQuery(): void {
    this.stackedStageMediaQuery = window.matchMedia(STACKED_STAGE_QUERY);
    this.stackedStageMediaQuery.addEventListener('change', this.handleStackedStageChange);
  }

  private initAnimation(): void {
    const elements = this.getAnimationElements();

    if (this.isStackedStage()) {
      this.initTabletPortraitAnimation(elements);
      return;
    }

    this.initDesktopAnimation(elements);
  }

  private initTabletPortraitAnimation(elements: AboutAnimationElements): void {
    this.animationContext?.revert();
    this.animationContext = gsap.context(
      () => this.buildTabletPortraitAnimation(elements),
      this.host.nativeElement,
    );
    scheduleScrollTriggerRefresh();
  }

  private initDesktopAnimation(elements: AboutAnimationElements): void {
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
    initScrollReveals(this.host.nativeElement, this.getTabletPortraitReveals());
  }

  private getTabletPortraitReveals(): readonly ScrollRevealConfig[] {
    return this.isCompactStackedStage()
      ? ABOUT_COMPACT_PORTRAIT_REVEALS
      : ABOUT_TABLET_PORTRAIT_REVEALS;
  }
  private setInitialChapterState(elements: AboutAnimationElements): void {
    const enterOffset = this.getChapterEnterOffsetPercent();

    gsap.set(elements.introChapter, { xPercent: -enterOffset, scale: 0.92, autoAlpha: 0.08 });
    gsap.set(elements.contextChapter, { xPercent: -enterOffset, scale: 0.6, autoAlpha: 0.08 });
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
        end: 'bottom',
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
      xPercent: this.getIntroExitOffsetPercent(),
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
      xPercent: this.getAboutExitOffsetPercent(),
      scale: 0.6,
      autoAlpha: 0.04,
      duration: 0.48,
    });
  }

  private isCompactStackedStage(): boolean {
    return window.matchMedia(COMPACT_STACKED_STAGE_QUERY).matches;
  }

  private getChapterEnterOffsetPercent(): number {
    return this.isLargeDesktopStage() ? 72 : 99;
  }

  private getIntroExitOffsetPercent(): number {
    return this.isLargeDesktopStage() ? 74 : 93;
  }

  private getAboutExitOffsetPercent(): number {
    return this.isLargeDesktopStage() ? 72 : 84;
  }

  private isLargeDesktopStage(): boolean {
    return window.matchMedia(LARGE_DESKTOP_STAGE_QUERY).matches;
  }

  private getEntryStart(): string {
    return ABOUT_SCROLL_START;
  }

  private isStackedStage(): boolean {
    return window.matchMedia(STACKED_STAGE_QUERY).matches;
  }
}
