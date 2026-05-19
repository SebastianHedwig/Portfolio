import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DesktopFooterComponent } from '../landing/components/desktop-footer/desktop-footer.component';
import { MobileFooterComponent } from '../landing/components/mobile-footer/mobile-footer.component';
import { SecondaryButtonComponent } from '../../shared/components/secondary-button/secondary-button.component';
import { LanguageStore } from '../../i18n/language.store';
import { getPrivacyContent } from './privacy.data';

const MOBILE_LAYOUT_QUERY = '(max-width: 1024px) and (orientation: portrait)';

@Component({
  selector: 'app-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SecondaryButtonComponent, DesktopFooterComponent, MobileFooterComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent implements OnDestroy {
  private readonly languageStore = inject(LanguageStore);

  readonly content = computed(() => getPrivacyContent(this.languageStore.language()));
  readonly isMobileLayout = signal(this.getInitialMobileLayout());

  private mobileLayoutMediaQuery: MediaQueryList | null = null;
  private cleanupMobileLayoutListener: (() => void) | null = null;

  constructor() {
    afterNextRender(() => this.initMobileLayoutQuery());
  }

  ngOnDestroy(): void {
    this.cleanupMobileLayoutListener?.();
    this.cleanupMobileLayoutListener = null;
    this.mobileLayoutMediaQuery = null;
  }

  closePage(): void {
    window.close();

    window.setTimeout(() => {
      window.location.href = this.languageStore.buildLocalizedPath(
        this.languageStore.language(),
      );
    }, 120);
  }

  private initMobileLayoutQuery(): void {
    this.mobileLayoutMediaQuery = window.matchMedia(MOBILE_LAYOUT_QUERY);
    this.syncMobileLayout();

    const handleChange = () => this.syncMobileLayout();
    this.mobileLayoutMediaQuery.addEventListener('change', handleChange);
    this.cleanupMobileLayoutListener = () => {
      this.mobileLayoutMediaQuery?.removeEventListener('change', handleChange);
    };
  }

  private syncMobileLayout(): void {
    this.isMobileLayout.set(this.mobileLayoutMediaQuery?.matches ?? false);
  }

  private getInitialMobileLayout(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(MOBILE_LAYOUT_QUERY).matches;
  }
}
