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
    this.animationContext = gsap.context(() => {
      gsap.set(stage, {
        yPercent: 24,
        autoAlpha: 0.2,
      });

      gsap.timeline({
        defaults: {
          ease: 'none',
        },
        scrollTrigger: {
          trigger: this.host.nativeElement,
          start: 'top bottom+=275%',
          end: 'top 62%',
          scrub: 1.7,
          invalidateOnRefresh: true,
        },
      }).to(stage, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1,
      });

      initScrollReveals(stage);
      this.initScrollLabels(stage);
    }, this.host.nativeElement);

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  private initScrollLabels(stage: HTMLElement): void {
    const stackGroups = Array.from(
      stage.querySelectorAll<HTMLElement>('app-tech-stack-stack-group'),
    );

    stackGroups.forEach((group) => {
      const label = group.querySelector<HTMLElement>('.tech-stage__group-label');
      const start = group.dataset['scrollRevealStart'] ?? 'top 88%';
      const end = group.dataset['scrollRevealEnd'] ?? 'bottom top';

      if (!label) return;

      ScrollTrigger.create({
        trigger: group,
        start,
        end,
        onEnter: () => label.classList.add('tech-stage__group-label--is-visible'),
        onEnterBack: () => label.classList.add('tech-stage__group-label--is-visible'),
        onLeaveBack: () => label.classList.remove('tech-stage__group-label--is-visible'),
      });
    });

    const learning = stage.querySelector<HTMLElement>('app-tech-stack-learning-item');
    const learningLabel = learning?.querySelector<HTMLElement>('.tech-stage__learning-label');

    if (!learning || !learningLabel) return;

    const start = learning.dataset['scrollRevealStart'] ?? 'top 88%';
    const end = learning.dataset['scrollRevealEnd'] ?? 'bottom top';

    ScrollTrigger.create({
      trigger: learning,
      start,
      end,
      onEnter: () => learningLabel.classList.add('tech-stage__label--is-visible'),
      onEnterBack: () => learningLabel.classList.add('tech-stage__label--is-visible'),
      onLeaveBack: () => learningLabel.classList.remove('tech-stage__label--is-visible'),
    });
  }
}
