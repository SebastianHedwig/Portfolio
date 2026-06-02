import { createCaseStudyContent, type CaseStudyMetaItem, type CaseStudyPageContent } from './case-studies.data';

const CASE_STUDY_PORTFOLIO_EN = `
# Project Overview

This project was created to represent me as a frontend developer, make my skills visible, and provide a central platform for projects, technologies, and personal work.

The website is primarily aimed at recruiters, potential employers, and people interested in modern web development, UI/UX design, and interactive user experiences. The goal was not only to present projects and technical skills, but to leave a lasting overall impression.

At the same time, the website was intended to stand apart from classic portfolio OnePagers. It should not work only as a project overview, but as a digital representation of my personality, working style, and design preferences. Through custom design, interactive elements, and modern visual accents, I wanted to create an identity that reflects both my technical direction and my personality.

Animations, such as the network animation in the background, were intended to create a user experience that attracts attention, stays memorable, and gives users small “aha moments” without compromising performance or usability.

Beyond that, the project was meant to underline my combination of business understanding and technical know-how. It should show that I understand digital products and user needs, while also being able to build modern, scalable, and performant web applications.

# Core Ideas

Many developer portfolios follow a very similar structure and can therefore feel interchangeable or purely functional. The focus is often limited to projects and technologies, while personality, recognition value, and user experience move into the background.

The challenge was to create a portfolio that combines professionalism and individuality without becoming overloaded or unclear. I wanted the website to communicate information, but also to create a visual and interactive impression that stays in mind.

It was equally important to build a modern and animation-rich design without negatively affecting performance or usability. Animations and interactions should be used deliberately to support the user experience instead of distracting from the content.

Another goal was to present projects in a more structured and appealing way, making both my technical skills and my personal design and development approach easier to understand.

# Goals & Requirements

For the portfolio, I defined both design and technical requirements. The goal was to develop a modern, interactive website that works reliably across devices while presenting a high-quality overall impression.

A responsive interface with clear information hierarchy and intuitive navigation was especially important. Content should be easy to scan and accessible on desktop, tablet, and mobile devices.

The technical implementation also needed to remain maintainable and flexible over time. For that reason, the application was built in a modular way, so new content, features, or adjustments can be integrated later without unnecessary friction.

Visually, I wanted to combine a modern aesthetic with interactive elements and smooth animations without making the page feel overloaded. Animations should not be purely decorative, but should actively support navigation and add more energy to the website.

Despite the visual effects, performance remained a central focus throughout development. The page needed fast loading times, smooth transitions, and a generally frictionless user experience.

# Research & Inspiration

At the beginning of the project, there was no single website or specific portfolio that I fully used as a reference. Instead, the design and technical direction emerged from different impressions, inspirations, and ideas I had collected over time.

Horizontal marquees with text information inside Hero sections were especially interesting to me. This form of presentation makes it possible to show information in a compact but dynamic way. That led to the idea of integrating an animated marquee to make important information visible without overloading the interface.

Modern motion design also had a strong influence on the project. Experiments and inspiration around GSAP, Three.js, and interactive websites created the desire to bring stronger visual dynamics into the portfolio, especially through animated backgrounds and interactive elements.

The idea for the network animation came from the wish to give the portfolio more depth and individuality. After seeing similar visual concepts, I wanted to find out how such an effect could be integrated into a modern website in a performant and harmonious way.

The color direction was also intentional from the beginning. Blue as my personal favorite color and my general preference for dark-mode interfaces influenced the design early on. Targeted cyan accents were added to highlight certain areas and give the interface more contrast and energy.

I also wanted to consciously break away from classic portfolio structures. The idea of presenting individual areas horizontally or through scroll-controlled staging came from modern layout concepts I had seen on other websites. This approach was meant to give the page more individuality and make the perception of each section more varied.

Ultimately, the portfolio came from many different impressions, inspirations, and individual concepts from various websites and portfolios. Instead of following one template, I combined different ideas, animations, layout approaches, and design concepts into my own visual and technical interpretation.

# Design Process

At the beginning of development, there was no fully defined UI concept or finished design system. Many ideas emerged directly during implementation in the browser and continued to evolve throughout the project.

The first foundation was a simple sketch of the page structure to capture basic areas, scroll directions, and interactions. Already at this early stage, the idea emerged to combine classic vertical navigation with scroll-controlled areas to present content in a more dynamic and interactive way.

Initial visual experiments focused on the Hero section. The combination of dark colors, large typography, and technical background elements quickly became a central design direction. The original mesh idea was gradually developed further and eventually replaced by the animated Network Background.

Based on these design foundations, a dark color world with targeted cyan accents emerged to combine technical aesthetics, contrast, and spatial depth. The palette was developed mainly through visual experimentation with transparency, opacity values, and different blue tones until the balance between technical impact and calm atmosphere felt right.

Typography was also developed through testing. After trying different Google Font combinations, I chose Space Grotesk and Sora. Space Grotesk is mainly used for navigation and smaller supporting information, while Sora serves as the primary font for larger text areas. The decisive factor was the combination of technical modernity and readability.

Another design focus was asymmetrical layout structures and intentionally placed spacing. Not every element follows the exact same axis or a fully symmetrical structure. The goal was to give the page more movement and individuality without making it feel chaotic.

A large amount of development work went into the responsive behavior of the application. Many challenges only appeared during implementation, especially around GSAP ScrollTrigger, reveal animations, and dynamic backgrounds. Different screen sizes required repeated adjustments to animation start and end points as well as navigation anchors.

Scaling larger visual elements, such as the Hero image or more complex grid structures, required more fine-tuning than expected. Through targeted breakpoints and dynamic media-query adjustments, the application could be optimized to work reliably and consistently across almost all screen sizes.

For the mobile view, I deliberately decided to avoid more complex scroll-controlled areas. While they add visual dynamics on larger screens, clearer and more intuitive guidance was more important on mobile devices. Content is therefore presented in a classic vertical flow on smaller screens.

The animated Network Background was also developed iteratively. The goal was not to create a dominant or hectic effect, but a calm, technical, spatial atmosphere that supports the content rather than competing with it.

The network clusters were intended to feel like floating structures in space and give the website additional depth without distracting from the actual content. To achieve this, I experimented extensively with transparency, movement intensity, and the number of animated elements.

During the design process, I also developed the idea of highlighting individual terms inside larger text blocks to emphasize key statements visually. Examples such as “Moderne Experiences überzeugen” or “Werkzeug nutzen” are not only visual accents, but also summarize content and add another layer of meaning.

Looking back, this part strongly reflects my background in marketing and business administration, because many of these decisions were consciously shaped by perception, impact, and user guidance.

# Technical Architecture

The technical architecture of my portfolio was designed from the beginning to combine modern frontend development, performant animations, and long-term maintainability. My goal was not only to build a visually appealing website, but an application that is technically structured, extensible, and close to production standards.

For the frontend, I chose Angular together with TypeScript and SCSS. Angular offered clear advantages in structure, component architecture, and long-term scalability. TypeScript helped me build components, services, and configuration more explicitly and safely, which was especially useful for complex animations and dynamic interactions.

The application is based on a modular component structure where reusable shared components are combined with section-specific components. Common elements such as navigation, buttons, or recurring UI structures were abstracted, while individual sections were built more specifically to match their visual and functional requirements.

The application was also structured so that larger functions and technically intensive areas are only loaded when they are actually needed. Lazy loading, dynamic imports, and targeted splitting of JavaScript areas into smaller chunks helped reduce the initial load and improve overall performance.

Animation-heavy and rendering-intensive areas were integrated in a way that avoids unnecessary initialization and uses resources more efficiently.

This created a good balance between performance, reusability, maintainability, and design flexibility. New content or additional areas can be integrated in a structured way without limiting the individual impact of each section or unnecessarily increasing complexity.

## Animation Architecture

For animations and scroll interactions, I deliberately chose GSAP instead of relying only on CSS-based solutions. Many of the effects are not simple transitions or hover animations, but respond dynamically to scroll position, screen size, and complex layout states.

Reveal animations, scroll-synchronized transitions, and responsive stage layouts required precise control over timing, start and end points, and behavior during layout changes. GSAP and ScrollTrigger made these animations much more reliable and controllable than pure SCSS or classic CSS transitions would have been.

Another advantage was the ability to adapt animations to different viewports and recalculate them cleanly after size changes. This control was especially important for the stability and user experience of complex scroll layouts and dynamic content areas.

SCSS remains responsible for layout, styling, breakpoints, and simple state changes, while GSAP handles scroll-synchronized and interactive animation logic. This created a clear separation between visual styling and more complex motion behavior.

## Three.js Background System

The decision to use Three.js was not primarily visual, but technical and performance-driven. The animated background is not based on classic DOM elements, but on a separate Canvas/WebGL system with its own scene, camera, and rendering pipeline.

The network clusters consist of animated line, node, and pulse structures that are continuously updated and transformed. A comparable implementation using DOM or SVG animations would have caused significantly more layout, paint, and reflow work and would have been harder to keep performant over time.

With Three.js, the animation could be fully decoupled from the actual DOM. Rendering, geometry, and material states are processed inside the WebGL pipeline, making the background animation much more efficient to control.

This means that the animated background controller is loaded only in the browser, avoiding unnecessary WebGL and animation processes during server rendering. FPS limits, reduced node density, optimized transparency values, low-power rendering, and execution outside Angular’s change detection cycle further improve performance.

Within this system, TypeScript mainly handles movement logic, configuration, and control of the individual network clusters, while Three.js provides the actual rendering infrastructure. That meant I did not have to build a custom rendering foundation while still keeping enough flexibility for individual animation logic.

## SEO & Internationalization

SEO and internationalization played an important role early in development. The application was equipped with canonical tags, hreflang configuration, structured data, a language-specific sitemap, and robots.txt to support discoverability and clean search engine indexing.

I also created a dedicated Angular SEO service to centrally manage meta tags, page titles, canonical URLs, robots directives, social preview data, and structured data. This makes content easier to maintain and adapt for different languages and page contexts.

## Security

In addition to frontend development, I considered security aspects early. These include form validation, honeypot mechanisms for the contact form, controlled external links, and a conscious handling of indexable and non-indexable pages.

On the infrastructure and server level, additional protection measures were implemented through the NGINX configuration. These include security headers, HTTPS, controlled server access, and rate limiting. SPF and DKIM were also configured to improve the deliverability and trustworthiness of outgoing emails.

My goal was to build the application not only in a functional and visually modern way, but also to include typical security and infrastructure topics early in the overall technical architecture.

## Deployment & Infrastructure

For running the application, I set up my own VPS infrastructure on Linux. Deployment, process management, and routing are handled through PM2 and NGINX.

I also configured SSL certificates, DNS settings, subdomains, permissions, and server structures to run the application in a stable and production-oriented way.

It was important to me not only to develop a visually modern portfolio, but a technically complete web application that considers frontend, animation, infrastructure, SEO, security, and deployment as one connected system.

# Challenges & Solutions

## Three.js Background System

The animated background was one of the biggest technical challenges of the entire project. Before starting, I had no practical experience with Three.js or WebGL-based rendering. Still, I knew early on that I wanted a background that stood apart from classic static or purely decorative animations.

The biggest challenge was to keep permanent movement performant and visually controlled without making the animation feel hectic or restless.

To solve this, I built an independent rendering system based on Three.js and WebGL, separated from the actual Angular DOM. The network structures consist of multiple layers with animated line, node, and pulse structures that are continuously transformed and updated.

Balancing visual effect and performance was especially demanding. Transparency values, node density, movement intensity, and rendering frequency had to be adjusted several times so the animation would remain calm and performant despite constant movement. Additional optimizations included FPS limits, low-power rendering, and execution outside Angular’s change detection cycle.

Looking back, this was one of the most demanding parts of the project, but also one of the most valuable learning experiences because it pushed me to work deeply with rendering, WebGL structures, and performant animation systems.

## GSAP & ScrollTrigger Architecture

Scroll-based animations were another major challenge. Before this project, I had not worked with GSAP or ScrollTrigger, but I wanted to create a more dynamic and interactive experience than a classic static scrolling page.

The main difficulty was keeping animations synchronized across different layout states and screen sizes. Reveal animations, responsive stage layouts, and complex scroll timelines reacted sensitively to resizing, layout shifts, and dynamic content.

To make this behavior more controllable, I created a two-part GSAP architecture. One part is a central reveal system for recurring fade and move-in animations. The other part consists of section-specific scroll timelines for more complex areas such as Hero, About, or Projects.

Responsive behavior was especially challenging. Start and end points for ScrollTrigger had to be adjusted and recalculated depending on viewport size, layout type, and content structure. I also integrated a custom refresh system so ScrollTrigger can remeasure correctly after layout changes or language switches.

The combination of scroll-controlled panel transitions, staggered layouts, and different mobile and desktop views required repeated revision and fine-tuning. Looking back, that iterative process was essential for developing a better understanding of scroll-based animation, user guidance, and responsive motion logic.

## SEO & Internationalization

SEO was another area I had to explore more deeply during the project. At first, my focus was mainly on design, animation, and frontend development. Over time, I became more aware of how important clean SEO structures are for visibility, indexing, and professional web applications.

The combination of multilingual content, language-specific routes, and dynamic metadata was a particular challenge. The goal was to make both the German and English versions cleanly indexable and avoid typical duplicate-content issues.

To solve this, I built a central Angular SEO service that dynamically manages meta tags, canonical URLs, hreflang configuration, structured data, and social preview information. This was complemented by language-specific routes, a structured sitemap, and robots directives for indexable and non-indexable pages.

Although SEO was not originally one of the main focus areas, it became an important part of the overall technical architecture during implementation. Working with search indexing, structured data, and internationalized routes significantly expanded my understanding of modern web platforms.

# Results & Learnings

Looking back, the project became much larger and more technical than initially planned. What started as a modern frontend portfolio gradually developed into a complete web application where design, animation, architecture, infrastructure, and user experience are closely connected.

I am especially satisfied with the final overall impression of the application. The combination of typography, animation, asymmetrical layouts, and the animated background creates exactly the technical and visual atmosphere I wanted to achieve.

Technically, many things developed the way I had imagined. The modular component structure, the separation between reusable shared components and section-specific areas, and the independent GSAP and Three.js architecture helped keep the application maintainable and extensible despite its complexity.

One of the biggest insights from the project was how strongly animations, layouts, and user guidance influence each other. Many challenges did not come from individual technologies themselves, but from the interaction between responsiveness, scroll behavior, rendering, and visual impact.

The project also expanded my understanding of topics I had previously only touched on superficially, including SEO, structured data, multilingual routing, rendering optimization, infrastructure, deployment, and running a web application on my own server environment.

Most importantly, I learned a lot about iterative development. Many solutions did not work on the first attempt, but emerged through continuous testing, adjustment, and refinement. That process showed me how important it is to evaluate technical decisions not only functionally, but also in terms of user experience, perception, and long-term maintainability.

# Final Reflection

Looking back, this project was much more than the development of a personal portfolio. It became an intensive learning process that shaped not only my technical skills, but also my overall way of thinking about projects, architecture, and creative development.

One of the most important insights was that complex frontend applications can only be planned in advance to a limited extent. During development, ideas, structures, and technical decisions change constantly. Concepts are discarded, rethought, or evolved during implementation.

This interaction between idea, technical feasibility, performance, user experience, and actual development effort showed me how dynamic modern frontend projects really are. Many things look clear in theory, but change significantly once real layouts, animations, responsiveness, and technical limitations come together.

This project was especially exciting because it was much freer and more open than many classic training projects. Instead of working from finished designs or fixed requirements, I had to make all design, technical, and architectural decisions myself. That helped me learn not only to build features, but to think through complete systems and user experiences.

Looking back, I am grateful that the project kept changing and growing during development. Many of the most important insights did not come from planning, but from experimenting, iterating, and solving concrete problems during implementation.

The project once again showed me that perfection rarely exists at the beginning and that many good ideas only become visible during the development process.

In the end, one thought remains especially true for me in IT:

» “Don’t overthink anything, just begin!” «

# Additional Notes

This case study documents and reflects on a personal frontend project. The focus is on presenting the development process, technical decisions, design approaches, and personal learnings.

It is not a scientific or academic paper. The content, inspirations, and technical concepts are based on personal experience, research, experimentation, and practical implementation during the development of the project.
`;

const CASE_STUDY_META_EN: readonly CaseStudyMetaItem[] = [
  {
    label: 'Role',
    value: 'Frontend Developer & Designer',
  },
  {
    label: 'Initial Release',
    value: '01-04-2026',
  },
  {
    label: 'Technologies',
    value: 'Angular, TypeScript, SCSS, GSAP, Three.js',
  },
  {
    label: 'Focus',
    value: 'Motion Design, UX, Performance, Architecture',
  },
  {
    href: 'https://github.com/SebastianHedwig/Portfolio',
    label: 'Repository',
    value: 'GitHub/Portfolio',
  },
] as const;

const CASE_STUDY_QUICK_FACTS_EN = [
  'Angular Frontend Architecture',
  'GSAP Scroll Animation System',
  'Three.js WebGL Background',
  'Responsive UI/UX',
  'SEO & Internationalization',
  'VPS Deployment & Infrastructure',
] as const;

export const CASE_STUDY_PAGE_CONTENT_EN: CaseStudyPageContent = createCaseStudyContent(
  {
    closeLabel: 'Close',
    eyebrow: 'Case Study',
    facts: CASE_STUDY_QUICK_FACTS_EN,
    factsTitle: 'Quick Facts',
    lead: 'A detailed case study about the concept, design, and technical implementation of my portfolio.',
    media: {
      designIdea: {
        alt: 'Early design idea for the portfolio interface',
        dialogLabel: 'Enlarged design idea',
        openLabel: 'Open enlarged design idea',
        src: 'assets/images/case-studies/designidea.webp',
      },
      wireframe: {
        alt: 'Early wireframe sketch of the portfolio structure',
        dialogLabel: 'Enlarged wireframe sketch',
        openLabel: 'Open enlarged wireframe sketch',
        src: 'assets/images/case-studies/wireframe_sketch.webp',
      },
    },
    meta: CASE_STUDY_META_EN,
    preview: {
      alt: 'Preview of the English portfolio homepage',
      src: 'assets/images/case-studies/portfolio-hero-preview-en.webp',
    },
    title: 'Portfolio',
  },
  CASE_STUDY_PORTFOLIO_EN,
);
