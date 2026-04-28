import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LocalizedAnchorNavigationService } from '../../navigation/localized-anchor-navigation.service';

@Component({
  selector: 'app-primary-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss',
})
export class PrimaryButtonComponent {
  private readonly anchorNavigation = inject(LocalizedAnchorNavigationService);

  readonly href = input<string | null>(null);
  readonly label = input.required<string>();
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly resolvedHref = computed(() => {
    const targetHref = this.href();

    if (!targetHref || !this.isAnchorHref(targetHref)) {
      return targetHref;
    }

    return this.anchorNavigation.buildHref(targetHref);
  });

  handleLinkClick(event: MouseEvent): void {
    const targetHref = this.href();

    if (this.disabled()) {
      event.preventDefault();
      return;
    }

    if (!targetHref || !this.isAnchorHref(targetHref)) {
      return;
    }

    this.anchorNavigation.handleClick(event, targetHref);
  }

  private isAnchorHref(targetHref: string): boolean {
    return targetHref.startsWith('#');
  }

  isExternalHref(targetHref: string): boolean {
    return /^https?:\/\//.test(targetHref);
  }
}
