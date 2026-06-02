import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageStore } from './i18n/language.store';
import { ViewportBackgroundComponent } from './shared/background/viewport-background.component';
import { SeoService } from './shared/seo/seo.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, ViewportBackgroundComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly seo = inject(SeoService);
  private readonly languageStore = inject(LanguageStore);

  readonly rotateDeviceMessage = computed(() =>
    this.languageStore.language() === 'de'
      ? 'Bitte verwende dein Gerät im Hochformat.'
      : 'Please turn your device to portrait',
  );
}
