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
import { LanguageStore } from '../../i18n/language.store';
import { TechStackLearningItemComponent } from './components/tech-stack-learning-item/tech-stack-learning-item.component';
import { TechStackStackGroupComponent } from './components/tech-stack-stack-group/tech-stack-stack-group.component';
import { TechStackTextBlockComponent } from './components/tech-stack-text-block/tech-stack-text-block.component';
import { getTechStackContent } from './tech-stack.data';

gsap.registerPlugin(ScrollTrigger);

const COMPACT_STACKED_STAGE_QUERY = '(max-width: 360px) and (max-height: 520px) and (orientation: portrait)';

const TECH_STACK_REVEALS: readonly ScrollRevealConfig[] = [
  {
    selector: '.tech-stage__intro',
    start: 'top 168%',
    end: 'top 82%',
  },
  {
    selector: '.tech-stage__stack--core',
    start: 'top 188%',
    end: 'top 104%',
  },
  {
    selector: '.tech-stage__learning',
    start: 'top 190%',
    end: 'top 106%',
  },
  {
    selector: '.tech-stage__focus',
    start: 'top 190%',
    end: 'top 108%',
  },
  {
    selector: '.tech-stage__stack--main',
    start: 'top 184%',
    end: 'top 102%',
  },
  {
    selector: '.tech-stage__stack--extended',
    start: 'top 176%',
    end: 'top 96%',
  },
] as const;

const TECH_STACK_COMPACT_REVEALS: readonly ScrollRevealConfig[] = [
  {
    selector: '.tech-stage__intro',
    start: 'top 168%',
    end: 'top 82%',
  },
  {
    selector: '.tech-stage__stack--core',
    start: 'top 206%',
    end: 'top 120%',
  },
  {
    selector: '.tech-stage__learning',
    start: 'top 230%',
    end: 'top 146%',
  },
  {
    selector: '.tech-stage__focus',
    start: 'top 234%',
    end: 'top 148%',
  },
  {
    selector: '.tech-stage__stack--main',
    start: 'top 230%',
    end: 'top 144%',
  },
  {
    selector: '.tech-stage__stack--extended',
    start: 'top 224%',
    end: 'top 138%',
  },
] as const;

@Component({
  selector: 'app-tech-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TechStackLearningItemComponent,
    TechStackStackGroupComponent,
    TechStackTextBlockComponent,
  ],
  templateUrl: './tech-stack.component.html',
  styleUrl: './tech-stack.component.scss',
})
export class TechStackComponent implements OnDestroy {
  readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly languageStore = inject(LanguageStore);
  private animationContext: gsap.Context | null = null;

  readonly content = computed(() => getTechStackContent(this.languageStore.language()));
  readonly introBlock = computed(() => this.content().introBlock);
  readonly focusBlock = computed(() => this.content().focusBlock);
  readonly learningItem = computed(() => this.content().learningItem);
  readonly coreGroup = computed(() => this.content().coreGroup);
  readonly mainGroup = computed(() => this.content().mainGroup);
  readonly extendedGroup = computed(() => this.content().extendedGroup);

  constructor() {
    afterNextRender(() => this.initAnimation());
  }

  ngOnDestroy(): void {
    this.animationContext?.revert();
    this.animationContext = null;
  }

  private initAnimation(): void {
    const stage = this.stage().nativeElement;

    this.animationContext?.revert();
    this.animationContext = gsap.context(() => this.buildAnimation(stage), this.host.nativeElement);
  }

  private buildAnimation(stage: HTMLElement): void {
    const revealConfigs = this.getRevealConfigs();

    this.setInitialStageState(stage);
    this.createStageEntrance(stage);
    initScrollReveals(stage, revealConfigs);
    this.initScrollLabels(stage, revealConfigs);
  }

  private setInitialStageState(stage: HTMLElement): void {
    gsap.set(stage, { yPercent: 24, autoAlpha: 0.2 });
  }

  private createStageEntrance(stage: HTMLElement): void {
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: this.host.nativeElement,
        start: 'top bottom+=275%',
        end: 'top 62%',
        scrub: 1.7,
        invalidateOnRefresh: true,
      },
    }).to(stage, { yPercent: 0, autoAlpha: 1, duration: 1 });
  }

  private initScrollLabels(stage: HTMLElement, revealConfigs: readonly ScrollRevealConfig[]): void {
    this.createGroupLabelTriggers(this.getStackGroups(stage), revealConfigs);
    this.createLearningLabelTrigger(stage, revealConfigs);
  }

  private getStackGroups(stage: HTMLElement): HTMLElement[] {
    return Array.from(stage.querySelectorAll<HTMLElement>('app-tech-stack-stack-group'));
  }

  private createGroupLabelTriggers(
    groups: readonly HTMLElement[],
    revealConfigs: readonly ScrollRevealConfig[],
  ): void {
    groups.forEach((group) => this.createGroupLabelTrigger(group, revealConfigs));
  }

  private createGroupLabelTrigger(
    group: HTMLElement,
    revealConfigs: readonly ScrollRevealConfig[],
  ): void {
    const label = group.querySelector<HTMLElement>('.tech-stage__group-label');
    if (!label) return;

    this.createVisibilityTrigger(
      group,
      label,
      this.getRevealStart(group, revealConfigs),
      'tech-stage__group-label--is-visible',
    );
  }

  private createLearningLabelTrigger(
    stage: HTMLElement,
    revealConfigs: readonly ScrollRevealConfig[],
  ): void {
    const learning = stage.querySelector<HTMLElement>('app-tech-stack-learning-item');
    const learningLabel = learning?.querySelector<HTMLElement>('.tech-stage__learning-label');
    if (!learning || !learningLabel) return;

    this.createVisibilityTrigger(
      learning,
      learningLabel,
      this.getRevealStart(learning, revealConfigs),
      'tech-stage__label--is-visible',
    );
  }

  private getRevealConfigs(): readonly ScrollRevealConfig[] {
    return window.matchMedia(COMPACT_STACKED_STAGE_QUERY).matches
      ? TECH_STACK_COMPACT_REVEALS
      : TECH_STACK_REVEALS;
  }

  private getRevealStart(
    element: HTMLElement,
    revealConfigs: readonly ScrollRevealConfig[],
  ): string {
    return revealConfigs.find((config) => element.matches(config.selector))?.start ?? 'top 88%';
  }

  private createVisibilityTrigger(
    trigger: HTMLElement,
    label: HTMLElement,
    start: string,
    visibleClass: string,
  ): void {
    ScrollTrigger.create({
      trigger,
      start,
      onEnter: () => label.classList.add(visibleClass),
      onEnterBack: () => label.classList.add(visibleClass),
      onLeave: () => label.classList.remove(visibleClass),
      onLeaveBack: () => label.classList.remove(visibleClass),
    });
  }
}
