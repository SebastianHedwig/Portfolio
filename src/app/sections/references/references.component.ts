import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { gsap } from 'gsap';

import { initScrollReveals } from '../../shared/animations/scroll-reveal';
import { type ScrollRevealConfig } from '../../shared/animations/scroll-reveal-config';
import { LanguageStore } from '../../i18n/language.store';
import { getReferencesContent, type ReferenceQuote } from './references.data';

const REFERENCES_REVEALS: readonly ScrollRevealConfig[] = [
  {
    selector: '.references-stage__header',
    start: 'top 104%',
    end: 'top 62%',
  },
  {
    selector: '.references-stage__quote--primary',
    start: 'top 100%',
    end: 'top 58%',
  },
  {
    selector: '.references-stage__quote--secondary',
    start: 'top 92%',
    end: 'top 50%',
  },
] as const;

@Component({
  selector: 'app-references',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss',
})
export class ReferencesComponent implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly languageStore = inject(LanguageStore);
  private animationContext: gsap.Context | null = null;

  readonly content = computed(() => getReferencesContent(this.languageStore.language()));
  readonly eyebrow = computed(() => this.content().eyebrow);
  readonly expandedQuoteIndexes = signal<ReadonlySet<number>>(new Set<number>());
  readonly title = computed(() => this.content().title);
  readonly quotes = computed(() => this.content().quotes);

  constructor() {
    afterNextRender(() => this.initAnimation());
  }

  ngOnDestroy(): void {
    this.animationContext?.revert();
    this.animationContext = null;
  }

  hasHiddenParagraphs(quote: ReferenceQuote): boolean {
    return quote.paragraphs.length > 1;
  }

  extraParagraphs(quote: ReferenceQuote): readonly string[] {
    return quote.paragraphs.slice(1);
  }

  isQuoteExpanded(index: number): boolean {
    return this.expandedQuoteIndexes().has(index);
  }

  quoteToggleLabel(index: number): string {
    return this.isQuoteExpanded(index)
      ? this.content().showLessLabel
      : this.content().showMoreLabel;
  }

  toggleQuote(index: number): void {
    this.expandedQuoteIndexes.update((expandedIndexes) => {
      const nextExpandedIndexes = new Set(expandedIndexes);

      if (nextExpandedIndexes.has(index)) {
        nextExpandedIndexes.delete(index);
      } else {
        nextExpandedIndexes.add(index);
      }

      return nextExpandedIndexes;
    });
  }

  private initAnimation(): void {
    this.animationContext?.revert();
    this.animationContext = gsap.context(() => {
      initScrollReveals(this.host.nativeElement, REFERENCES_REVEALS);
    }, this.host.nativeElement);
  }
}
