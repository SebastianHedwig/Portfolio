import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';

import { DesktopHeaderComponent } from './components/desktop-header/desktop-header.component';
import { DesktopFooterComponent } from './components/desktop-footer/desktop-footer.component';
import { AboutComponent } from '../../sections/about/about.component';
import { ContactComponent } from '../../sections/contact/contact.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { LanguageStore } from '../../i18n/language.store';
import { scheduleScrollTriggerRefresh } from '../../shared/animations/scroll-trigger-refresh';
import { ProjectsComponent } from '../../sections/projects/projects.component';
import { ReferencesComponent } from '../../sections/references/references.component';
import { TechStackComponent } from '../../sections/tech-stack/tech-stack.component';

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DesktopHeaderComponent,
    HeroComponent,
    AboutComponent,
    TechStackComponent,
    ProjectsComponent,
    ReferencesComponent,
    ContactComponent,
    DesktopFooterComponent,
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
        scheduleScrollTriggerRefresh();
      });

      onCleanup(() => cancelAnimationFrame(refreshFrameId));
    });
  }
}
