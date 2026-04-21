import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SecondaryButtonComponent } from '../../shared/components/secondary-button/secondary-button.component';

@Component({
  selector: 'app-imprint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SecondaryButtonComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent {
  readonly sections = [
    {
      title: 'Anbieterangaben',
      paragraphs: [
        'Die finalen Angaben fuer das Impressum werden hier im naechsten Schritt eingefuegt.',
        'Aktuell dient dieser Bereich als Platzhalter fuer Name, Anschrift, Kontakt und weitere gesetzlich erforderliche Informationen.',
      ],
    },
    {
      title: 'Kontakt',
      paragraphs: [
        'Hier folgt spaeter der verbindliche Kontaktblock mit E-Mail-Adresse und weiteren Pflichtangaben.',
      ],
    },
    {
      title: 'Hinweise',
      paragraphs: [
        'Sobald der finale Text vorliegt, wird diese Seite inhaltlich vollstaendig ersetzt, das Layout kann so bestehen bleiben.',
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
