import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SecondaryButtonComponent } from '../../shared/components/secondary-button/secondary-button.component';

@Component({
  selector: 'app-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SecondaryButtonComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {
  readonly sections = [
    {
      title: 'Datenschutz auf einen Blick',
      paragraphs: [
        'Der finale Text fuer die Datenschutzerklaerung wird hier im naechsten Schritt eingefuegt.',
        'Aktuell ist dieser Bereich bewusst als Platzhalter angelegt, damit Struktur und Gestaltung bereits sauber vorbereitet sind.',
      ],
    },
    {
      title: 'Verarbeitung personenbezogener Daten',
      paragraphs: [
        'Hier folgt spaeter der konkrete Fliesstext zu Zweck, Umfang, Rechtsgrundlage und Speicherdauer der Datenverarbeitung.',
      ],
    },
    {
      title: 'Kontaktformular und technische Dienste',
      paragraphs: [
        'Sobald du mir den finalen Inhalt gibst, ersetze ich diesen Abschnitt durch die verbindlichen Hinweise zu Formular, Hosting und weiteren eingesetzten Diensten.',
      ],
    },
  ] as const;

  closePage(): void {
    window.close();

    window.setTimeout(() => {
      window.location.href = '/';
    }, 120);
  }
}
