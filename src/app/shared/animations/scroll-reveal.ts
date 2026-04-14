import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  type RevealProfile,
  type ScrollRevealConfig,
} from './scroll-reveal-config';
import { scheduleScrollTriggerRefresh } from './scroll-trigger-refresh';

gsap.registerPlugin(ScrollTrigger);

interface RevealRange {
  end: number;
  start: number;
}

interface ResolvedRevealTarget {
  config?: ScrollRevealConfig;
  target: HTMLElement;
}

const BASE_VIEWPORT_HEIGHT = 1080;

export function initScrollReveals(
  root: HTMLElement,
  configs: readonly ScrollRevealConfig[] = [],
): void {
  const targets = resolveRevealTargets(root, configs);
  const triggerCache = new Map<string, HTMLElement | null>();

  if (targets.length === 0) return;

  targets.forEach(({ target, config }) => {
    const range = getRevealRange(target, config?.profile);
    const start =
      config?.start ?? target.dataset['scrollRevealStart'] ?? `top ${range.start}%`;
    const end =
      config?.end ?? target.dataset['scrollRevealEnd'] ?? `top ${range.end}%`;
    const triggerSelector = config?.trigger ?? target.dataset['scrollRevealTrigger'];
    const cachedTrigger =
      triggerSelector === undefined
        ? null
        : (triggerCache.has(triggerSelector)
            ? triggerCache.get(triggerSelector)
            : triggerCache
                .set(triggerSelector, root.querySelector<HTMLElement>(triggerSelector))
                .get(triggerSelector)) ?? null;
    const trigger = cachedTrigger ?? target;

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
          trigger,
          start,
          end,
          scrub: 0.8,
        },
        y: 0,
      },
    );
  });

  scheduleScrollTriggerRefresh();
}

function resolveRevealTargets(
  root: HTMLElement,
  configs: readonly ScrollRevealConfig[],
): readonly ResolvedRevealTarget[] {
  if (configs.length > 0) {
    return configs.flatMap((config) =>
      Array.from(root.querySelectorAll<HTMLElement>(config.selector), (target) => ({
        target,
        config,
      })),
    );
  }

  return gsap
    .utils.toArray<HTMLElement>('[data-scroll-reveal]', root)
    .map((target) => ({ target }));
}

function getRevealRange(
  target: HTMLElement,
  profileOverride?: RevealProfile,
): RevealRange {
  const profile = getRevealProfile(target, profileOverride);
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

function getRevealProfile(
  target: HTMLElement,
  profileOverride?: RevealProfile,
): RevealProfile {
  const profile = profileOverride ?? target.dataset['scrollRevealProfile'];

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
