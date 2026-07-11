import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { type TechStackItemData } from '../../tech-stack.models';
import { LanguageStore } from '../../../../i18n/language.store';

const POPUP_EXIT_DURATION_MS = 220;

type PlannedStackData = {
  items: TechStackItemData[];
  title: string;
};

@Component({
  selector: 'app-tech-stack-learning-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './tech-stack-learning-item.component.html',
  styleUrl: './tech-stack-learning-item.component.scss',
  host: {
    'class': 'tech-stage__learning',
  },
})
export class TechStackLearningItemComponent implements OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly languageStore = inject(LanguageStore);
  private popupCloseTimeoutId: number | null = null;

  readonly item = input.required<TechStackItemData>();
  readonly plannedStack = input.required<PlannedStackData>();
  readonly popupId = computed(() => `${this.slugify(this.item().alt)}-planned-stack`);
  readonly isPopupRendered = signal(false);
  readonly isPopupVisible = signal(false);
  readonly tooltipLabel = computed(() =>
    this.languageStore.language() === 'de' ? 'Anzeigen' : 'Show',
  );
  readonly tooltipPosition = signal({ x: 0, y: 0 });
  readonly isTooltipActive = signal(false);
  readonly isTooltipVisible = computed(() =>
    this.isTooltipActive() && !this.isPopupRendered(),
  );

  togglePopup(event: MouseEvent): void {
    event.stopPropagation();
    this.isTooltipActive.set(false);

    if (this.isPopupVisible()) {
      const shouldRestoreTooltip = this.shouldRestoreTooltipAfterClose(event);
      this.closePopup();

      if (shouldRestoreTooltip) {
        this.updateTooltipPosition(event);
        this.isTooltipActive.set(true);
      }

      return;
    }

    this.openPopup();
  }

  closePopup(): void {
    this.isTooltipActive.set(false);
    this.clearPopupCloseTimeout();

    if (!this.isPopupRendered()) {
      return;
    }

    this.isPopupVisible.set(false);
    this.popupCloseTimeoutId = window.setTimeout(() => {
      this.isPopupRendered.set(false);
      this.popupCloseTimeoutId = null;
    }, POPUP_EXIT_DURATION_MS);
  }

  ngOnDestroy(): void {
    this.clearPopupCloseTimeout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isPopupRendered()) {
      return;
    }

    const target = event.target;

    if (target instanceof Node && this.elementRef.nativeElement.contains(target)) {
      return;
    }

    this.closePopup();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closePopup();
  }

  showTooltip(event: MouseEvent): void {
    if (this.isPopupRendered()) {
      return;
    }

    this.updateTooltipPosition(event);
    this.isTooltipActive.set(true);
  }

  moveTooltip(event: MouseEvent): void {
    if (!this.isTooltipActive()) {
      return;
    }

    this.updateTooltipPosition(event);
  }

  hideTooltip(): void {
    this.isTooltipActive.set(false);
  }

  private openPopup(): void {
    this.isTooltipActive.set(false);
    this.clearPopupCloseTimeout();
    this.isPopupRendered.set(true);
    requestAnimationFrame(() => {
      this.isPopupVisible.set(true);
    });
  }

  private clearPopupCloseTimeout(): void {
    if (this.popupCloseTimeoutId === null) {
      return;
    }

    window.clearTimeout(this.popupCloseTimeoutId);
    this.popupCloseTimeoutId = null;
  }

  private slugify(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  private updateTooltipPosition(event: MouseEvent): void {
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();

    this.tooltipPosition.set({
      x: event.clientX - hostRect.left + 14,
      y: event.clientY - hostRect.top + 14,
    });
  }

  private shouldRestoreTooltipAfterClose(event: MouseEvent): boolean {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return false;
    }

    return event.currentTarget instanceof HTMLElement && event.currentTarget.matches(':hover');
  }
}
