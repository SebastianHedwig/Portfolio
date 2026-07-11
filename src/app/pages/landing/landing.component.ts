import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  afterNextRender,
  signal,
} from '@angular/core';

import { DesktopHeaderComponent } from './components/desktop-header/desktop-header.component';
import { DesktopFooterComponent } from './components/desktop-footer/desktop-footer.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { MobileFooterComponent } from './components/mobile-footer/mobile-footer.component';
import { AboutComponent } from '../../sections/about/about.component';
import { CaseStudiesComponent } from '../../sections/case-studies/case-studies.component';
import { ContactComponent } from '../../sections/contact/contact.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { ProjectsComponent } from '../../sections/projects/projects.component';
import { ReferencesComponent } from '../../sections/references/references.component';
import { TechStackComponent } from '../../sections/tech-stack/tech-stack.component';

const MOBILE_LAYOUT_QUERY = '(max-width: 1024px) and (orientation: portrait)';
const LANDING_SECTION_IDS = [
  'hero',
  'about',
  'tech-stack',
  'projects',
  'case-studies',
  'references',
  'contact',
] as const;

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DesktopHeaderComponent,
    MobileHeaderComponent,
    HeroComponent,
    AboutComponent,
    TechStackComponent,
    ProjectsComponent,
    CaseStudiesComponent,
    ReferencesComponent,
    ContactComponent,
    DesktopFooterComponent,
    MobileFooterComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnDestroy {
  readonly isMobileLayout = signal(this.getInitialMobileLayout());

  private mobileLayoutMediaQuery: MediaQueryList | null = null;
  private cleanupMobileLayoutListener: (() => void) | null = null;
  private cleanupScrollListener: (() => void) | null = null;
  private cleanupInitialScrollListeners: (() => void) | null = null;
  private hashSyncFrame: number | null = null;
  private originalScrollRestoration: ScrollRestoration | null = null;
  private resetScrollTimeouts: number[] = [];

  constructor() {
    afterNextRender(() => this.initAfterRender());
  }

  ngOnDestroy(): void {
    this.cleanupMobileLayoutListener?.();
    this.cleanupScrollListener?.();
    this.cleanupInitialScrollListeners?.();

    for (const timeoutId of this.resetScrollTimeouts) {
      window.clearTimeout(timeoutId);
    }

    if (this.hashSyncFrame !== null) {
      window.cancelAnimationFrame(this.hashSyncFrame);
    }

    if (this.originalScrollRestoration !== null) {
      window.history.scrollRestoration = this.originalScrollRestoration;
    }

    this.cleanupMobileLayoutListener = null;
    this.cleanupScrollListener = null;
    this.cleanupInitialScrollListeners = null;
    this.mobileLayoutMediaQuery = null;
    this.hashSyncFrame = null;
    this.originalScrollRestoration = null;
    this.resetScrollTimeouts = [];
  }

  private initAfterRender(): void {
    this.disableBrowserScrollRestoration();
    this.initMobileLayoutQuery();

    const didHandleInitialFragment = this.scrollToInitialFragment();
    if (!didHandleInitialFragment) {
      this.resetInitialScrollPosition();
    }

    this.initActiveSectionHashSync(!didHandleInitialFragment);

    if (didHandleInitialFragment) {
      window.setTimeout(() => this.scheduleActiveSectionHashSync(), 350);
    }
  }

  private disableBrowserScrollRestoration(): void {
    if (!('scrollRestoration' in window.history)) return;

    this.originalScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
  }

  private resetInitialScrollPosition(): void {
    const scrollToTop = () => {
      if (this.hasNonHeroHash()) return;

      this.forceScrollToTop();
    };
    const handlePageShow = () => scrollToTop();
    const handleLoad = () => scrollToTop();

    window.addEventListener('pageshow', handlePageShow, { once: true });
    window.addEventListener('load', handleLoad, { once: true });
    this.cleanupInitialScrollListeners = () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('load', handleLoad);
    };

    scrollToTop();
    window.requestAnimationFrame(() => {
      scrollToTop();
      window.requestAnimationFrame(scrollToTop);
    });

    this.resetScrollTimeouts = [50, 150, 300, 600, 900].map((delay) =>
      window.setTimeout(scrollToTop, delay),
    );
  }

  private forceScrollToTop(): void {
    const hero = document.getElementById('hero');
    const top = hero
      ? hero.getBoundingClientRect().top + window.scrollY
      : 0;

    window.scrollTo({ top, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = top;
    document.body.scrollTop = top;
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

  private scrollToInitialFragment(): boolean {
    const fragment = window.location.hash.replace(/^#/, '');
    if (!fragment) return false;

    if (fragment === 'hero') {
      this.forceScrollToTop();
      window.history.replaceState(null, '', this.getCurrentPath());
      return true;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(fragment)?.scrollIntoView({
        block: 'start',
        behavior: 'auto',
      });
    });

    return true;
  }

  private initActiveSectionHashSync(syncImmediately: boolean): void {
    const handleScroll = () => this.scheduleActiveSectionHashSync();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    this.cleanupScrollListener = () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };

    if (syncImmediately) {
      this.scheduleActiveSectionHashSync();
    }
  }

  private scheduleActiveSectionHashSync(): void {
    if (this.hashSyncFrame !== null) return;

    this.hashSyncFrame = window.requestAnimationFrame(() => {
      this.hashSyncFrame = null;
      this.syncActiveSectionHash();
    });
  }

  private syncActiveSectionHash(): void {
    const activeSectionId = this.getActiveLandingSectionId();
    if (!activeSectionId) return;

    const nextUrl = activeSectionId === 'hero'
      ? this.getCurrentPath()
      : `${this.getCurrentPath()}#${activeSectionId}`;

    if (window.location.pathname + window.location.hash === nextUrl) return;

    window.history.replaceState(null, '', nextUrl);
  }

  private getActiveLandingSectionId(): string | null {
    const activationLine = window.innerHeight * 0.38;
    let activeSectionId: string | null = null;

    for (const sectionId of LANDING_SECTION_IDS) {
      const section = document.getElementById(sectionId);
      if (!section) continue;

      if (section.getBoundingClientRect().top <= activationLine) {
        activeSectionId = sectionId;
      }
    }

    return activeSectionId;
  }

  private getCurrentPath(): string {
    return window.location.pathname.replace(/\/+$/, '') || '/';
  }

  private hasNonHeroHash(): boolean {
    const fragment = window.location.hash.replace(/^#/, '');
    return Boolean(fragment && fragment !== 'hero');
  }
}
