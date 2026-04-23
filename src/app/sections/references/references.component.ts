import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { gsap } from 'gsap';

import { initScrollReveals } from '../../shared/animations/scroll-reveal';
import { type ScrollRevealConfig } from '../../shared/animations/scroll-reveal-config';
import { LanguageStore } from '../../i18n/language.store';
import { getReferencesContent } from './references.data';

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
  readonly title = computed(() => this.content().title);
  readonly quotes = computed(() => this.content().quotes);

  constructor() {
    afterNextRender(() => this.initAnimation());
  }

  ngOnDestroy(): void {
    this.animationContext?.revert();
    this.animationContext = null;
  }

  private initAnimation(): void {
    this.animationContext?.revert();
    this.animationContext = gsap.context(() => {
      initScrollReveals(this.host.nativeElement, REFERENCES_REVEALS);
    }, this.host.nativeElement);
  }
}
