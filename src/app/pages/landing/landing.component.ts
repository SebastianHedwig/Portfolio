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
import { ContactComponent } from '../../sections/contact/contact.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { ProjectsComponent } from '../../sections/projects/projects.component';
import { ReferencesComponent } from '../../sections/references/references.component';
import { TechStackComponent } from '../../sections/tech-stack/tech-stack.component';

const MOBILE_LAYOUT_QUERY = '(max-width: 1024px) and (orientation: portrait)';

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

  constructor() {
    afterNextRender(() => this.initMobileLayoutQuery());
  }

  ngOnDestroy(): void {
    this.cleanupMobileLayoutListener?.();
    this.cleanupMobileLayoutListener = null;
    this.mobileLayoutMediaQuery = null;
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
