import { type AboutContent } from './about.data';

export const ABOUT_CONTENT_DE: AboutContent = {
  portrait: {
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
  },
  viewportAriaLabel: 'Über-mich-Sequenz',
  introLead: {
    containerClass: 'about-stage__text-zone about-stage__text-zone--lead',
    title: 'Mein Anspruch',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'h2',
    copy:
      'Für mich gibt es keine Probleme! \nNur Wege zur Lösung.\n\nIch bleibe dran. \nBis aus einer Idee etwas entsteht, das wirklich funktioniert und überzeugt.',
    copyClass: 'about-stage__support',
  },
  introVision: {
    containerClass: 'about-stage__text-zone about-stage__text-zone--vision',
    eyebrow: 'Über mich',
    eyebrowClass: 'about-stage__eyebrow',
    title: 'Meine Vision.',
    titleClass: 'about-stage__statement',
    titleTag: 'h2',
    subtitle: 'Der Blick nach vorn.',
    subtitleClass: 'about-stage__statement about-stage__statement--secondary',
    subtitleTag: 'p',
    copy:
      'Mein Bestreben ist es, mich kontinuierlich weiterzuentwickeln und moderne Webanwendungen ganzheitlich zu verstehen. Im Frontend möchte ich mein Wissen über Angular hinaus gezielt durch Technologien wie React, Vue.js und Flutter erweitern.\n\nGleichzeitig möchte ich meine Backend-Kompetenzen mit Python ausbauen und mein Verständnis für APIs, Containerisierung und Entwicklungsprozesse mithilfe von Docker und Postman weiter vertiefen. Mein Ziel ist es, Anwendungen nicht nur zu entwickeln, sondern ihre Architektur und technischen Zusammenhänge umfassend zu verstehen.',
    copyClass: 'about-stage__support',
  },
  introSecondary: {
    containerClass: 'about-stage__text-zone about-stage__text-zone--secondary',
    title: 'Der Weg ist nicht immer gerade.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'p',
    copy:
      'Beim Radfahren wie in der Entwicklung zählt nicht nur Tempo. Fortschritt entsteht nicht immer linear. Manchmal läuft es leicht, manchmal kosten Gegenwind und Umwege Kraft.\n\nWichtig ist, dranzubleiben, den Blick neu auszurichten und Lösungen Schritt für Schritt zu verbessern.',
    mobileCopy:
      'Beim Radfahren wie in der Entwicklung zählt nicht nur Tempo. Fortschritt entsteht nicht immer linear. Manchmal läuft es leicht, manchmal kosten Gegenwind und Umwege Kraft.\n\nWichtig ist, dranzubleiben, den Blick neu auszurichten und Lösungen Schritt für Schritt zu verbessern.',
    copyClass: 'about-stage__support',
  },
  contextLeft: {
    containerClass: 'about-stage__context-block about-stage__context-block--left',
    title: 'Fokussiert.\nKlar.\nDirekt.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'p',
    valueStatements: [
      { lead: 'Fokussiert', detail: 'in der Umsetzung.' },
      { lead: 'Klar', detail: 'in der Struktur.' },
      { lead: 'Direkt', detail: 'in der Kommunikation.' },
    ],
    copy: '',
    copyClass: 'about-stage__support',
  },
  contextBottomHead: {
    containerClass: 'about-stage__context-bottom-head',
    title: '',
    titleClass: '',
    titleTag: 'p',
    copy:
      'Klare digitale Erlebnisse entstehen nicht zufällig.\nSie sind das Ergebnis von Fokus, Sorgfalt und sauberer Umsetzung.',
    copyClass: 'about-stage__support',
  },
  contextCenter: {
    containerClass: 'about-stage__context-block about-stage__context-block--center',
    title: 'Was mich antreibt.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'p',
    copy:
      'Mich motiviert der Moment, in dem aus einer Idee ein Erlebnis wird, das nicht nur präzise ist, sondern beim Nutzer spürbar etwas hinterlässt.',
    copyClass: 'about-stage__support',
  },
  contextRight: {
    containerClass: 'about-stage__context-block about-stage__context-block--right',
    title: 'Aus Flörsheim.\n Mit Anspruch im Detail.',
    titleClass: 'about-stage__context-title',
    titleTag: 'p',
    copy:
      'Ich arbeite strukturiert, ruhig und mit Blick für das Wesentliche. So entstehen digitale Erlebnisse, die klar geführt sind, sauber funktionieren und im Detail überzeugen.',
    copyClass: 'about-stage__context-copy',
  },
} as const;
