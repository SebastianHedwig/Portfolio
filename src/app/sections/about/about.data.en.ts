import { type AboutContent } from './about.data';

export const ABOUT_CONTENT_EN: AboutContent = {
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
    alt: 'Sebastian Hedwig in a calm personal scene',
  },
  viewportAriaLabel: 'About sequence',
  introLead: {
    containerClass: 'about-stage__text-zone about-stage__text-zone--lead',
    title: 'One goal. One path.',
    titleClass: 'about-stage__statement',
    titleTag: 'h2',
    copy:
      'To me, there are no problems — \nOnly paths toward a solution.\n\nI keep going — \nUntil an idea becomes something that truly works and convinces.',
    copyClass: 'about-stage__support',
  },
  introSecondary: {
    containerClass: 'about-stage__text-zone about-stage__text-zone--secondary',
    title: 'The path is not always straight.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'p',
    copy:
      'Sometimes it moves easily, \nsometimes it takes strength and time.\n\nWhat matters is staying with it.\nIt is worth walking.',
    copyClass: 'about-stage__support',
  },
  contextLeft: {
    containerClass: 'about-stage__context-block about-stage__context-block--left',
    title: 'Calm.\nClear.\nDirect.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'p',
    copy:
      'Clear digital experiences do not happen by accident — they are the result of conviction, focus, and precise execution.',
    copyClass: 'about-stage__support',
  },
  contextCenter: {
    containerClass: 'about-stage__context-block about-stage__context-block--center',
    title: 'What drives me.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'p',
    copy:
      'I am motivated by the moment when an idea turns into an experience that is not only precise, but leaves a tangible impression on the user.',
    copyClass: 'about-stage__support',
  },
  contextRight: {
    containerClass: 'about-stage__context-block about-stage__context-block--right',
    title: 'From Flörsheim. Intentional down to the details.',
    titleClass: 'about-stage__context-title',
    titleTag: 'p',
    copy:
      'I work in a structured, calm way and with a clear sense of what a project actually needs.',
    copyClass: 'about-stage__context-copy',
  },
} as const;
