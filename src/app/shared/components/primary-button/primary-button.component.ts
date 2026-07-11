import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);

  readonly href = input<string | null>(null);
  readonly hoverLabel = input<string | null>(null);
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

    if (!targetHref || !this.isPlainPrimaryClick(event)) {
      return;
    }

    if (this.isAnchorHref(targetHref)) {
      this.anchorNavigation.handleClick(event, targetHref);
      return;
    }

    if (this.isInternalPathHref(targetHref)) {
      event.preventDefault();
      void this.router.navigateByUrl(targetHref);
    }
  }

  private isAnchorHref(targetHref: string): boolean {
    return targetHref.startsWith('#');
  }

  private isInternalPathHref(targetHref: string): boolean {
    return targetHref.startsWith('/');
  }

  private isPlainPrimaryClick(event: MouseEvent): boolean {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  isExternalHref(targetHref: string): boolean {
    return /^https?:\/\//.test(targetHref);
  }
}
