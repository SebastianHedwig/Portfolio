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
import { TechStackLearningItemComponent } from './components/tech-stack-learning-item/tech-stack-learning-item.component';
import { TechStackStackGroupComponent } from './components/tech-stack-stack-group/tech-stack-stack-group.component';
import { TechStackTextBlockComponent } from './components/tech-stack-text-block/tech-stack-text-block.component';
import {
  TECH_STACK_CORE_GROUP,
  TECH_STACK_EXTENDED_GROUP,
  TECH_STACK_FOCUS_BLOCK,
  TECH_STACK_INTRO_BLOCK,
  TECH_STACK_LEARNING_ITEM,
  TECH_STACK_MAIN_GROUP,
} from './tech-stack.data';

gsap.registerPlugin(ScrollTrigger);

const TECH_STACK_REVEALS: readonly ScrollRevealConfig[] = [
  {
    selector: '.tech-stage__intro',
    start: 'top 148%',
    end: 'top 82%',
  },
  {
    selector: '.tech-stage__stack--core',
    start: 'top 144%',
    end: 'top 88%',
  },
  {
    selector: '.tech-stage__learning',
    start: 'top 146%',
    end: 'top 90%',
  },
  {
    selector: '.tech-stage__focus',
    start: 'top 146%',
    end: 'top 92%',
  },
  {
    selector: '.tech-stage__stack--main',
    start: 'top 140%',
    end: 'top 86%',
  },
  {
    selector: '.tech-stage__stack--extended',
    start: 'top 132%',
    end: 'top 80%',
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
  private animationContext: gsap.Context | null = null;

  readonly introBlock = TECH_STACK_INTRO_BLOCK;
  readonly focusBlock = TECH_STACK_FOCUS_BLOCK;
  readonly learningItem = TECH_STACK_LEARNING_ITEM;
  readonly coreGroup = TECH_STACK_CORE_GROUP;
  readonly mainGroup = TECH_STACK_MAIN_GROUP;
  readonly extendedGroup = TECH_STACK_EXTENDED_GROUP;

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
    this.setInitialStageState(stage);
    this.createStageEntrance(stage);
    initScrollReveals(stage, TECH_STACK_REVEALS);
    this.initScrollLabels(stage);
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

  private initScrollLabels(stage: HTMLElement): void {
    this.createGroupLabelTriggers(this.getStackGroups(stage));
    this.createLearningLabelTrigger(stage);
  }

  private getStackGroups(stage: HTMLElement): HTMLElement[] {
    return Array.from(stage.querySelectorAll<HTMLElement>('app-tech-stack-stack-group'));
  }

  private createGroupLabelTriggers(groups: readonly HTMLElement[]): void {
    groups.forEach((group) => this.createGroupLabelTrigger(group));
  }

  private createGroupLabelTrigger(group: HTMLElement): void {
    const label = group.querySelector<HTMLElement>('.tech-stage__group-label');
    if (!label) return;

    this.createVisibilityTrigger(
      group,
      label,
      this.getRevealStart(group),
      'tech-stage__group-label--is-visible',
    );
  }

  private createLearningLabelTrigger(stage: HTMLElement): void {
    const learning = stage.querySelector<HTMLElement>('app-tech-stack-learning-item');
    const learningLabel = learning?.querySelector<HTMLElement>('.tech-stage__learning-label');
    if (!learning || !learningLabel) return;

    this.createVisibilityTrigger(
      learning,
      learningLabel,
      this.getRevealStart(learning),
      'tech-stage__label--is-visible',
    );
  }

  private getRevealStart(element: HTMLElement): string {
    return TECH_STACK_REVEALS.find((config) => element.matches(config.selector))?.start ?? 'top 88%';
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
