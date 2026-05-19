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

import { LanguageStore } from '../../i18n/language.store';
import { initScrollReveals } from '../../shared/animations/scroll-reveal';
import { type ScrollRevealConfig } from '../../shared/animations/scroll-reveal-config';
import { getCaseStudiesContent } from './case-studies.data';

const CASE_STUDIES_REVEALS: readonly ScrollRevealConfig[] = [
  {
    selector: '.case-studies-stage__header',
    start: 'top 104%',
    end: 'top 62%',
  },
  {
    selector: '.case-studies-stage__badge',
    start: 'top 98%',
    end: 'top 58%',
  },
] as const;

@Component({
  selector: 'app-case-studies',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './case-studies.component.html',
  styleUrl: './case-studies.component.scss',
})
export class CaseStudiesComponent implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly languageStore = inject(LanguageStore);
  private animationContext: gsap.Context | null = null;

  readonly content = computed(() => getCaseStudiesContent(this.languageStore.language()));

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
      initScrollReveals(this.host.nativeElement, CASE_STUDIES_REVEALS);
    }, this.host.nativeElement);
  }
}
