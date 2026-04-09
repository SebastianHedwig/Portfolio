import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealProfile = 'default' | 'tech' | 'tech-intro';

interface RevealRange {
  end: number;
  start: number;
}

const BASE_VIEWPORT_HEIGHT = 1080;

export function initScrollReveals(root: HTMLElement): void {
  const targets = gsap.utils.toArray<HTMLElement>('[data-scroll-reveal]', root);

  targets.forEach((target) => {
    const range = getRevealRange(target);
    const start = target.dataset['scrollRevealStart'] ?? `top ${range.start}%`;
    const end = target.dataset['scrollRevealEnd'] ?? `top ${range.end}%`;

    gsap.fromTo(
      target,
      {
        autoAlpha: 0,
        y: 42,
      },
      {
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: target,
          start,
          end,
          scrub: 0.8,
        },
        y: 0,
      },
    );
  });
}

function getRevealRange(target: HTMLElement): RevealRange {
  const profile = getRevealProfile(target);
  const heightProgress = getViewportHeightProgress();

  if (profile === 'tech-intro') {
    return {
      start: scaleViewportStop(152),
      end: scaleViewportStop(81),
    };
  }

  if (profile === 'tech') {
    return {
      start: scaleViewportStop(146),
      end: scaleViewportStop(90),
    };
  }

  return {
    start: interpolate(100, 92, heightProgress),
    end: interpolate(58, 52, heightProgress),
  };
}

function getRevealProfile(target: HTMLElement): RevealProfile {
  const profile = target.dataset['scrollRevealProfile'];

  if (profile === 'tech' || profile === 'tech-intro') return profile;
  return 'default';
}

function getViewportHeightProgress(): number {
  return clamp((window.innerHeight - 1080) / (1440 - 1080), 0, 1);
}

function scaleViewportStop(percentAtBaseHeight: number): number {
  const offsetFromViewportBottom =
    ((percentAtBaseHeight - 100) / 100) * BASE_VIEWPORT_HEIGHT;

  return roundToTenth(
    100 + (offsetFromViewportBottom / window.innerHeight) * 100,
  );
}

function interpolate(from: number, to: number, progress: number): number {
  return roundToTenth(from + (to - from) * progress);
}

function roundToTenth(value: number): number {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
