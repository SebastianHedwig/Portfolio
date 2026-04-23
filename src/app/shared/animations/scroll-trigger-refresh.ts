import { ScrollTrigger } from 'gsap/ScrollTrigger';

let pendingOuterRefreshId: number | null = null;
let pendingInnerRefreshId: number | null = null;
let pendingTimeoutRefreshId: number | null = null;
let pendingIdleRefreshId: number | null = null;
let pendingRefreshCallbacks: Array<() => void> = [];

export function scheduleScrollTriggerRefresh(onComplete?: () => void): void {
  if (onComplete) {
    pendingRefreshCallbacks.push(onComplete);
  }

  if (
    pendingOuterRefreshId !== null
    || pendingInnerRefreshId !== null
    || pendingTimeoutRefreshId !== null
    || pendingIdleRefreshId !== null
  ) return;

  pendingOuterRefreshId = requestAnimationFrame(() => {
    pendingOuterRefreshId = null;
    pendingInnerRefreshId = requestAnimationFrame(() => {
      pendingInnerRefreshId = null;
      scheduleDeferredRefresh();
    });
  });
}

function scheduleDeferredRefresh(): void {
  if (typeof window.requestIdleCallback === 'function') {
    pendingIdleRefreshId = window.requestIdleCallback(() => {
      pendingIdleRefreshId = null;
      runRefresh();
    }, { timeout: 180 });
    return;
  }

  pendingTimeoutRefreshId = window.setTimeout(() => {
    pendingTimeoutRefreshId = null;
    runRefresh();
  }, 0);
}

function runRefresh(): void {
  ScrollTrigger.refresh();

  const callbacks = pendingRefreshCallbacks;
  pendingRefreshCallbacks = [];
  callbacks.forEach((callback) => callback());
}
