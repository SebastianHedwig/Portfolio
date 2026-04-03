import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AboutImageComponent } from './components/about-image/about-image.component';
import { AboutTextBlockComponent } from './components/about-text-block/about-text-block.component';
import { type AboutImageData, type AboutTextBlockData } from './about.models';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AboutImageComponent, AboutTextBlockComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly portrait: AboutImageData = {
    src: 'assets/images/about/sebastian-about-640.jpg',
    srcset: `
      assets/images/about/sebastian-about-320.jpg 320w,
      assets/images/about/sebastian-about-480.jpg 480w,
      assets/images/about/sebastian-about-640.jpg 640w,
      assets/images/about/sebastian-about-960.jpg 960w
    `,
    sizes: '(max-width: 48rem) calc(100vw - 2rem), 30rem',
    width: 640,
    height: 1441,
    decoding: 'async',
    alt: 'Sebastian Hedwig in einer ruhigen persönlichen Szene',
  };

  readonly introLead: AboutTextBlockData = {
    containerClass: 'about-stage__text-zone about-stage__text-zone--lead',
    title: 'Ein Ziel. Ein Weg.',
    titleClass: 'about-stage__statement',
    titleTag: 'h2',
    copy:
      'Für mich gibt es keine Probleme — \nNur Wege zur Lösung.\n\nIch bleibe dran — \nBis aus einer Idee etwas entsteht, das wirklich funktioniert und überzeugt.',
    copyClass: 'about-stage__support',
  };

  readonly introSecondary: AboutTextBlockData = {
    containerClass: 'about-stage__text-zone about-stage__text-zone--secondary',
    title: 'Der Weg ist nicht immer gerade.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'p',
    copy:
      'Manchmal geht es leichter, \nmanchmal kostet es Kraft und Zeit.\n\nEntscheidend ist, dranzubleiben.\nEr ist es wert, gegangen zu werden.',
    copyClass: 'about-stage__support',
  };

  readonly contextLeft: AboutTextBlockData = {
    containerClass: 'about-stage__context-block about-stage__context-block--left',
    title: 'Aus Flörsheim. Mit Haltung im Detail.',
    titleClass: 'about-stage__context-title',
    titleTag: 'p',
    copy:
      'Ich arbeite strukturiert, ruhig und mit einem klaren Blick auf das, was ein Projekt wirklich braucht.',
    copyClass: 'about-stage__context-copy',
  };

  readonly contextCenter: AboutTextBlockData = {
    containerClass:
      'about-stage__context-block about-stage__context-block--center',
    title: 'Ruhig. Klar. Direkt.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'p',
    copy:
      'Klare digitale Erlebnisse entstehen nicht zufällig — Sie sind das Ergebnis von Haltung, Fokus und sauberer Umsetzung.',
    copyClass: 'about-stage__support',
  };

  readonly contextRight: AboutTextBlockData = {
    containerClass:
      'about-stage__context-block about-stage__context-block--right',
    title: 'Was mich antreibt.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'p',
    copy:
      'Mich motiviert der Moment, in dem aus einer Idee ein Erlebnis wird, das nicht nur präzise ist, sondern beim Nutzer spürbar etwas hinterlässt.',
    copyClass: 'about-stage__support',
  };
}
