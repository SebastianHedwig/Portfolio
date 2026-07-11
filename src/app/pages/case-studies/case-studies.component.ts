import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';

import { LanguageStore } from '../../i18n/language.store';
import { LanguageToggleComponent } from '../../shared/components/language-toggle/language-toggle.component';
import { SecondaryButtonComponent } from '../../shared/components/secondary-button/secondary-button.component';
import { LocalizedAnchorNavigationService } from '../../shared/navigation/localized-anchor-navigation.service';
import { DesktopFooterComponent } from '../landing/components/desktop-footer/desktop-footer.component';
import { MobileFooterComponent } from '../landing/components/mobile-footer/mobile-footer.component';
import { type CaseStudyMediaItem, getCaseStudyPageContent } from './case-studies.data';
import { type LegalPageBlock } from '../imprint/imprint.data';

const MOBILE_LAYOUT_QUERY = '(max-width: 1024px) and (orientation: portrait)';

@Component({
  selector: 'app-case-studies-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LanguageToggleComponent, SecondaryButtonComponent, DesktopFooterComponent, MobileFooterComponent],
  templateUrl: './case-studies.component.html',
  styleUrls: [
    './case-studies.component.scss',
    './case-studies.meta.scss',
  ],
})
export class CaseStudiesPageComponent implements OnDestroy {
  private readonly languageStore = inject(LanguageStore);
  private readonly anchorNavigation = inject(LocalizedAnchorNavigationService);

  readonly content = computed(() => getCaseStudyPageContent(this.languageStore.language()));
  readonly openSections = signal<ReadonlySet<number>>(new Set([0]));
  readonly isMobileLayout = signal(this.getInitialMobileLayout());
  readonly activeMedia = signal<CaseStudyMediaItem | null>(null);

  private mobileLayoutMediaQuery: MediaQueryList | null = null;
  private cleanupMobileLayoutListener: (() => void) | null = null;
  private previousBodyOverflow: string | null = null;

  constructor() {
    afterNextRender(() => this.initMobileLayoutQuery());
  }

  ngOnDestroy(): void {
    this.unlockPageScroll();
    this.cleanupMobileLayoutListener?.();
    this.cleanupMobileLayoutListener = null;
    this.mobileLayoutMediaQuery = null;
  }

  closePage(): void {
    void this.anchorNavigation.navigate('#case-studies');
  }

  sectionId(index: number): string {
    return `case-study-section-${index}`;
  }

  sectionNumber(index: number): string {
    return `${index + 1}.`;
  }

  subsectionNumber(
    sectionIndex: number,
    blocks: readonly LegalPageBlock[] | undefined,
    blockIndex: number,
  ): string {
    const headingIndex = (blocks ?? [])
      .slice(0, blockIndex + 1)
      .filter((block) => block.type === 'heading').length;

    return `${sectionIndex + 1}.${headingIndex}`;
  }

  isSectionOpen(index: number): boolean {
    return this.openSections().has(index);
  }

  toggleSection(index: number): void {
    const nextSections = new Set(this.openSections());

    if (nextSections.has(index)) {
      nextSections.delete(index);
    } else {
      nextSections.add(index);
    }

    this.openSections.set(nextSections);
  }

  openSection(index: number): void {
    this.openSections.set(new Set([index]));

    window.requestAnimationFrame(() => {
      document.getElementById(this.sectionId(index))?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  openMediaDialog(media: CaseStudyMediaItem): void {
    this.lockPageScroll();
    this.activeMedia.set(media);
  }

  closeMediaDialog(): void {
    this.activeMedia.set(null);
    this.unlockPageScroll();
  }

  shouldShowDesignIdea(sectionTitle: string, text: string): boolean {
    return this.isDesignProcessSection(sectionTitle) && (
      text.includes('erste visuelle Experimente') ||
      text.includes('Initial visual experiments')
    );
  }

  shouldShowWireframe(sectionTitle: string, text: string): boolean {
    return this.isDesignProcessSection(sectionTitle) && (
      text.includes('Skizze') ||
      text.includes('sketch')
    );
  }

  isQuoteIntro(text: string): boolean {
    return text.startsWith('Oder wie Mark Twain') || text.startsWith('Or as Mark Twain');
  }

  isClosingQuote(text: string): boolean {
    return (
      text.includes('Don’t overthink') ||
      text.includes('Geheimnis des Vorwärtskommens') ||
      text.includes('secret of getting ahead')
    );
  }

  isQuoteAttribution(text: string): boolean {
    return text.startsWith('Mark Twain');
  }

  @HostListener('document:keydown.escape')
  closeMediaDialogByEscape(): void {
    this.closeMediaDialog();
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

  private lockPageScroll(): void {
    if (this.previousBodyOverflow !== null) {
      return;
    }

    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  private unlockPageScroll(): void {
    if (this.previousBodyOverflow === null) {
      return;
    }

    document.body.style.overflow = this.previousBodyOverflow;
    this.previousBodyOverflow = null;
  }

  private isDesignProcessSection(sectionTitle: string): boolean {
    return sectionTitle === 'Designprozess' || sectionTitle === 'Design Process';
  }
}
