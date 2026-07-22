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
    title: 'My requirement.',
    titleClass: 'about-stage__statement about-stage__statement--secondary about-stage__statement--intro-en',
    titleTag: 'h3',
    copy:
      'To me, there are no problems! \nOnly paths toward a solution.\n\nI stay with the process. \nUntil an idea becomes a viable approach.',
    copyClass: 'about-stage__support',
  },
  introVision: {
    containerClass: 'about-stage__text-zone about-stage__text-zone--vision',
    eyebrow: 'About',
    eyebrowClass: 'about-stage__eyebrow',
    title: 'My vision',
    titleClass: 'about-stage__statement about-stage__statement--intro-en',
    titleTag: 'h2',
    subtitle: 'Looking ahead.',
    subtitleClass: 'about-stage__statement about-stage__statement--secondary',
    subtitleTag: 'h3',
    copy:
      'My aspiration is to keep developing continuously and to keep broadening my perspective on modern web development. In the frontend, I want to go beyond Angular and deepen my knowledge of technologies such as React, Vue.js, and Flutter.\n\nIn addition, I want to strengthen my backend skills with Python and sharpen my understanding of APIs, containerization, and development processes with Docker and Postman. The goal is not only to build applications, but to understand their architecture and technical relationships comprehensively.',
    copyClass: 'about-stage__support',
  },
  introSecondary: {
    containerClass: 'about-stage__text-zone about-stage__text-zone--secondary',
    title: 'The path is not always straight.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'h3',
    copy:
      'In cycling, as in development, speed is not the only thing that matters. Progress is not always linear. Sometimes it feels easy, sometimes headwind and detours take effort.\n\nWhat matters is to persevere, adjust the perspective and improve solutions step by step.',
    mobileCopy:
      'In cycling, as in development, speed is not the only thing that matters. Progress is not always linear. Sometimes it feels easy, sometimes headwind and detours take effort.\n\nWhat matters is to persevere, adjust the perspective and improve solutions step by step.',
    copyClass: 'about-stage__support',
  },
  contextLeft: {
    containerClass: 'about-stage__context-block about-stage__context-block--left',
    title: 'Focused in execution. Clear in structure. Direct in communication.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'p',
    valueStatements: [
      { lead: 'Focused', detail: 'in execution.' },
      { lead: 'Clear', detail: 'in structure.' },
      { lead: 'Direct', detail: 'in communication.' },
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
      'Clear digital experiences do not happen by accident.\nThey are the result of focus, care, and precise execution.',
    copyClass: 'about-stage__support',
  },
  contextCenter: {
    containerClass: 'about-stage__context-block about-stage__context-block--center',
    title: 'What drives me.',
    titleClass: 'about-stage__statement about-stage__statement--secondary',
    titleTag: 'h3',
    copy:
      'I am motivated by the moment when details come together, workflows become understandable, and complexity turns into a clear user experience.',
    copyClass: 'about-stage__support',
  },
  contextRight: {
    containerClass: 'about-stage__context-block about-stage__context-block--right',
    title: 'From Flörsheim.\n With intent in every detail.',
    titleClass: 'about-stage__context-title',
    titleTag: 'h3',
    copy:
      'Whether on site or remote, I work in a structured, calm way and with a clear focus on what matters. This creates digital solutions that are clearly guided, cleanly implemented, and consistent in the details.',
    copyClass: 'about-stage__context-copy',
  },
} as const;
