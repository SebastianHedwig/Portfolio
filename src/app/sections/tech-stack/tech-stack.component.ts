import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

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
export class TechStackComponent {
  private readonly isLearningHovered = signal(false);

  readonly introBlock = TECH_STACK_INTRO_BLOCK;
  readonly focusBlock = TECH_STACK_FOCUS_BLOCK;
  readonly learningItem = TECH_STACK_LEARNING_ITEM;
  readonly coreGroup = TECH_STACK_CORE_GROUP;
  readonly mainGroup = TECH_STACK_MAIN_GROUP;
  readonly extendedGroup = TECH_STACK_EXTENDED_GROUP;

  readonly forceCoreGroupLabelVisible = this.isLearningHovered.asReadonly();

  handleLearningHover(isHovered: boolean): void {
    this.isLearningHovered.set(isHovered);
  }
}
