import { ChangeDetectionStrategy, Component } from '@angular/core';

type TechStackItem = {
  alt: string;
  letters: string[];
  src: string;
};

@Component({
  selector: 'app-tech-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './tech-stack.component.html',
  styleUrl: './tech-stack.component.scss',
})
export class TechStackComponent {
  private createItem(alt: string, src: string): TechStackItem {
    return { alt, letters: Array.from(alt), src };
  }

  readonly coreStack: TechStackItem[] = [
    this.createItem('HTML', 'assets/icons/tech-stack/Html.svg'),
    this.createItem('CSS', 'assets/icons/tech-stack/Css.svg'),
    this.createItem('JavaScript', 'assets/icons/tech-stack/JavScript.svg'),
  ];

  readonly mainStack: TechStackItem[] = [
    this.createItem('TypeScript', 'assets/icons/tech-stack/Typescript.svg'),
    this.createItem('Angular', 'assets/icons/tech-stack/Angular.svg'),
    this.createItem('SCSS', 'assets/icons/tech-stack/Sass.svg'),
  ];

  readonly extendedStack: TechStackItem[] = [
    this.createItem('API', 'assets/icons/tech-stack/Api.svg'),
    this.createItem('Firebase', 'assets/icons/tech-stack/Firebase.svg'),
    this.createItem('Supabase', 'assets/icons/tech-stack/Supabase.svg'),
    this.createItem('Git', 'assets/icons/tech-stack/Git.svg'),
    this.createItem('Scrum', 'assets/icons/tech-stack/Scrum.svg'),
    this.createItem('Figma', 'assets/icons/tech-stack/Figma.svg'),
    this.createItem(
      'Material Design',
      'assets/icons/tech-stack/Material Design.svg',
    ),
  ];
}
