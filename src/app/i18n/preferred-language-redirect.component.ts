import { ChangeDetectionStrategy, Component } from '@angular/core';

import { redirectToPreferredLanguage } from './language-routing';

@Component({
  selector: 'app-preferred-language-redirect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: '',
})
export class PreferredLanguageRedirectComponent {
  constructor() {
    void redirectToPreferredLanguage();
  }
}
