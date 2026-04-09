import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  signal,
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
  private readonly isLearningHovered = signal(false);
  private animationContext: gsap.Context | null = null;

  readonly introBlock = TECH_STACK_INTRO_BLOCK;
  readonly focusBlock = TECH_STACK_FOCUS_BLOCK;
  readonly learningItem = TECH_STACK_LEARNING_ITEM;
  readonly coreGroup = TECH_STACK_CORE_GROUP;
  readonly mainGroup = TECH_STACK_MAIN_GROUP;
  readonly extendedGroup = TECH_STACK_EXTENDED_GROUP;

  readonly forceCoreGroupLabelVisible = this.isLearningHovered.asReadonly();

  constructor() {
    afterNextRender(() => this.initAnimation());
  }

  ngOnDestroy(): void {
    this.animationContext?.revert();
    this.animationContext = null;
  }

  handleLearningHover(isHovered: boolean): void {
    this.isLearningHovered.set(isHovered);
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
    }, this.host.nativeElement);

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}
