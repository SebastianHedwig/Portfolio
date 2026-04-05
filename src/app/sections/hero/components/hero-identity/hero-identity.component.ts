import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { type HeroIdentityData } from '../../hero.models';

@Component({
  selector: 'app-hero-identity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './hero-identity.component.html',
  styleUrl: './hero-identity.component.scss',
})
export class HeroIdentityComponent {
  readonly content = input.required<HeroIdentityData>();
  readonly firstName = computed(() => this.getFirstName());
  readonly accentedInitial = computed(() => this.getAccentedInitial());
  readonly surnameTail = computed(() => this.getSurnameTail());

  private getFirstName(): string {
    const [firstName = ''] = this.getNameParts();
    return firstName;
  }

  private getAccentedInitial(): string {
    const [, surname = ''] = this.getNameParts();
    return surname.charAt(0);
  }

  private getSurnameTail(): string {
    const [, surname = ''] = this.getNameParts();
    return surname.slice(1);
  }

  private getNameParts(): [string, string] {
    const [firstName = '', surname = ''] = this.content().name.split(' ', 2);
    return [firstName, surname];
  }
}
