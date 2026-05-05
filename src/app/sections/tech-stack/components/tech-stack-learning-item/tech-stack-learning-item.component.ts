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
  private popupCloseTimeoutId: number | null = null;

  readonly item = input.required<TechStackItemData>();
  readonly plannedStack = input.required<PlannedStackData>();
  readonly popupId = computed(() => `${this.slugify(this.item().alt)}-planned-stack`);
  readonly isPopupRendered = signal(false);
  readonly isPopupVisible = signal(false);

  togglePopup(event: MouseEvent): void {
    event.stopPropagation();

    if (this.isPopupVisible()) {
      this.closePopup();
      return;
    }

    this.openPopup();
  }

  closePopup(): void {
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

  private openPopup(): void {
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
}
