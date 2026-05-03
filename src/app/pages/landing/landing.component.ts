import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';

import { DesktopHeaderComponent } from './components/desktop-header/desktop-header.component';
import { DesktopFooterComponent } from './components/desktop-footer/desktop-footer.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { MobileFooterComponent } from './components/mobile-footer/mobile-footer.component';
import { AboutComponent } from '../../sections/about/about.component';
import { ContactComponent } from '../../sections/contact/contact.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { LanguageStore } from '../../i18n/language.store';
import { ProjectsComponent } from '../../sections/projects/projects.component';
import { ReferencesComponent } from '../../sections/references/references.component';
import { TechStackComponent } from '../../sections/tech-stack/tech-stack.component';

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
export class LandingComponent {
  private readonly languageStore = inject(LanguageStore);

  constructor() {
    effect((onCleanup) => {
      this.languageStore.language();

      const refreshFrameId = requestAnimationFrame(() => {
        void this.scheduleScrollTriggerRefresh();
      });

      onCleanup(() => cancelAnimationFrame(refreshFrameId));
    });
  }

  private async scheduleScrollTriggerRefresh(): Promise<void> {
    const { scheduleScrollTriggerRefresh } = await import(
      '../../shared/animations/scroll-trigger-refresh'
    );

    scheduleScrollTriggerRefresh();
  }
}
