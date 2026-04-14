import { ScrollTrigger } from 'gsap/ScrollTrigger';

let pendingRefreshId: number | null = null;

export function scheduleScrollTriggerRefresh(): void {
  if (pendingRefreshId !== null) return;

  pendingRefreshId = requestAnimationFrame(() => {
    pendingRefreshId = null;
    ScrollTrigger.refresh();
  });
}
