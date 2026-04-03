import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { TechStackLearningItemComponent } from './components/tech-stack-learning-item/tech-stack-learning-item.component';
import { TechStackStackGroupComponent } from './components/tech-stack-stack-group/tech-stack-stack-group.component';
import { TechStackTextBlockComponent } from './components/tech-stack-text-block/tech-stack-text-block.component';
import {
  type TechStackGroupData,
  type TechStackItemData,
  type TechStackLabelData,
  type TechStackTextBlockData,
} from './tech-stack.models';

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

  private createLabel(text: string): TechStackLabelData {
    return { letters: Array.from(text) };
  }

  private createItem(alt: string, src: string): TechStackItemData {
    return { alt, letters: this.createLabel(alt).letters, src };
  }

  readonly introBlock: TechStackTextBlockData = {
    containerClass: 'tech-stage__intro',
    eyebrow: 'Tech Stack',
    titleClass: 'tech-stage__headline',
    titleLines: [
      'Technologie ist Werkzeug.',
      'Entscheidend ist, wie man sie nutzt.',
    ],
    titleTag: 'h2',
    copyClass: 'tech-stage__copy',
    copyLines: [
      'Ich arbeite nicht mit möglichst vielen Tools,',
      'sondern mit den richtigen — sinnvoll gewählt',
      'und bewusst eingesetzt.',
    ],
  };

  readonly focusBlock: TechStackTextBlockData = {
    containerClass: 'tech-stage__focus',
    titleClass: 'tech-stage__subheadline',
    titleLines: ['Weniger ist mehr.'],
    titleTag: 'h3',
    copyClass: 'tech-stage__copy tech-stage__copy--compact',
    copyLines: [
      'Ein durchdachter, reduzierter Stack',
      'führt zu besseren Ergebnissen',
      'als komplexe Setups ohne Richtung.',
    ],
  };

  readonly learningItem = this.createItem(
    'Still learning',
    'assets/icons/tech-stack/Continually Learning.svg',
  );

  readonly coreGroup: TechStackGroupData = {
    variant: 'core',
    groupLabel: this.createLabel('Fundament'),
    items: [
      this.createItem('HTML', 'assets/icons/tech-stack/Html.svg'),
      this.createItem('CSS', 'assets/icons/tech-stack/Css.svg'),
      this.createItem('JavaScript', 'assets/icons/tech-stack/JavaScript.svg'),
    ],
  };

  readonly mainGroup: TechStackGroupData = {
    variant: 'main',
    groupLabel: this.createLabel('Täglich im Einsatz'),
    items: [
      this.createItem('TypeScript', 'assets/icons/tech-stack/Typescript.svg'),
      this.createItem('Angular', 'assets/icons/tech-stack/Angular.svg'),
      this.createItem('SCSS', 'assets/icons/tech-stack/Sass.svg'),
    ],
  };

  readonly extendedGroup: TechStackGroupData = {
    variant: 'extended',
    groupLabel: this.createLabel('Unterstützende Erweiterungen'),
    items: [
      this.createItem('REST API', 'assets/icons/tech-stack/Api.svg'),
      this.createItem('Firebase', 'assets/icons/tech-stack/Firebase.svg'),
      this.createItem('Supabase', 'assets/icons/tech-stack/Supabase.svg'),
      this.createItem('Git', 'assets/icons/tech-stack/Git.svg'),
      this.createItem('Scrum', 'assets/icons/tech-stack/Scrum.svg'),
      this.createItem('VS Code', 'assets/icons/tech-stack/VSCode.svg'),
      this.createItem(
        'Material Design',
        'assets/icons/tech-stack/Material Design.svg',
      ),
    ],
  };

  readonly forceCoreGroupLabelVisible = this.isLearningHovered.asReadonly();

  handleLearningHover(isHovered: boolean): void {
    this.isLearningHovered.set(isHovered);
  }
}
