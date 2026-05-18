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
const STACKED_PORTRAIT_QUERY = '(max-width: 1024px) and (orientation: portrait)';

export function initScrollReveals(
  root: HTMLElement,
  configs: readonly ScrollRevealConfig[] = [],
): void {
  const targets = resolveRevealTargets(root, configs);
  const triggerCache = new Map<string, HTMLElement | null>();

  if (targets.length === 0) return;

  targets.forEach((target) => initRevealTarget(root, target, triggerCache));

  if (!isStackedPortraitViewport()) {
    scheduleScrollTriggerRefresh();
  }
}

function initRevealTarget(
  root: HTMLElement,
  targetConfig: ResolvedRevealTarget,
  triggerCache: Map<string, HTMLElement | null>,
): void {
  const { target, config } = targetConfig;
  const trigger = resolveTrigger(root, target, config, triggerCache);
  createRevealTween(target, trigger, config);
}

function resolveTrigger(
  root: HTMLElement,
  target: HTMLElement,
  config: ScrollRevealConfig | undefined,
  triggerCache: Map<string, HTMLElement | null>,
): HTMLElement {
  const selector = config?.trigger ?? target.dataset['scrollRevealTrigger'];
  if (selector === undefined) return target;
  return readCachedTrigger(root, selector, triggerCache) ?? target;
}

function readCachedTrigger(
  root: HTMLElement,
  selector: string,
  triggerCache: Map<string, HTMLElement | null>,
): HTMLElement | null {
  if (!triggerCache.has(selector)) {
    triggerCache.set(selector, root.querySelector<HTMLElement>(selector));
  }
  return triggerCache.get(selector) ?? null;
}

function createRevealTween(
  target: HTMLElement,
  trigger: HTMLElement,
  config?: ScrollRevealConfig,
): void {
  gsap.fromTo(target, getRevealFromVars(), getRevealToVars(target, trigger, config));
}

function getRevealFromVars(): gsap.TweenVars {
  return { autoAlpha: 0, y: 42 };
}

function getRevealToVars(
  target: HTMLElement,
  trigger: HTMLElement,
  config?: ScrollRevealConfig,
): gsap.TweenVars {
  return {
    autoAlpha: 1,
    ease: 'none',
    scrollTrigger: createRevealTrigger(target, trigger, config),
    y: 0,
  };
}

function createRevealTrigger(
  target: HTMLElement,
  trigger: HTMLElement,
  config?: ScrollRevealConfig,
): ScrollTrigger.Vars {
  return {
    trigger,
    start: () => resolveRevealStart(target, config),
    end: () => resolveRevealEnd(target, config),
    invalidateOnRefresh: true,
    scrub: 0.8,
  };
}

function resolveRevealStart(
  target: HTMLElement,
  config?: ScrollRevealConfig,
): string {
  const range = getRevealRange(target, config?.profile);
  return config?.start ?? target.dataset['scrollRevealStart'] ?? `top ${range.start}%`;
}

function resolveRevealEnd(
  target: HTMLElement,
  config?: ScrollRevealConfig,
): string {
  const range = getRevealRange(target, config?.profile);
  return config?.end ?? target.dataset['scrollRevealEnd'] ?? `top ${range.end}%`;
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

  if (profile === 'tech-intro') return getTechIntroRevealRange();
  if (profile === 'tech') return getTechRevealRange();
  return getDefaultRevealRange(heightProgress);
}

function getTechIntroRevealRange(): RevealRange {
  return { start: scaleViewportStop(152), end: scaleViewportStop(81) };
}

function getTechRevealRange(): RevealRange {
  return { start: scaleViewportStop(146), end: scaleViewportStop(90) };
}

function getDefaultRevealRange(heightProgress: number): RevealRange {
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

function isStackedPortraitViewport(): boolean {
  return window.matchMedia(STACKED_PORTRAIT_QUERY).matches;
}
