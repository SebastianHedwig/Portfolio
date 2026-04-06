import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-projects-stage-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './projects-stage-content.component.html',
  styleUrl: './projects-stage-content.component.scss',
})
export class ProjectsStageContentComponent {
  readonly index = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();

  isJoinTitle(): boolean {
    return this.title().toLowerCase() === 'join';
  }

  titleInitial(): string {
    return this.title().charAt(0);
  }

  titleRemainder(): string {
    return this.title().slice(1);
  }
}
