import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
} from '@angular/core';
import { gsap } from 'gsap';

import { initScrollReveals } from '../../shared/animations/scroll-reveal';
import { type ScrollRevealConfig } from '../../shared/animations/scroll-reveal-config';
import {
  REFERENCES_EYEBROW,
  REFERENCES_QUOTES,
  REFERENCES_TITLE,
} from './references.data';

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
  readonly eyebrow = REFERENCES_EYEBROW;
  readonly title = REFERENCES_TITLE;
  readonly quotes = REFERENCES_QUOTES;

  private readonly host = inject(ElementRef<HTMLElement>);
  private animationContext: gsap.Context | null = null;

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
