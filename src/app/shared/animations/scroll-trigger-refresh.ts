import { ScrollTrigger } from 'gsap/ScrollTrigger';

let pendingOuterRefreshId: number | null = null;
let pendingInnerRefreshId: number | null = null;
let pendingTimeoutRefreshId: number | null = null;
let pendingIdleRefreshId: number | null = null;

export function scheduleScrollTriggerRefresh(): void {
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
      ScrollTrigger.refresh();
    }, { timeout: 180 });
    return;
  }

  pendingTimeoutRefreshId = window.setTimeout(() => {
    pendingTimeoutRefreshId = null;
    ScrollTrigger.refresh();
  }, 0);
}
