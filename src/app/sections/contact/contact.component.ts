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

const CONTACT_REVEALS: readonly ScrollRevealConfig[] = [
  {
    selector: '.contact-stage__header',
  },
  {
    selector: '.contact-stage__column',
  },
] as const;

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnDestroy {
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
      initScrollReveals(this.host.nativeElement, CONTACT_REVEALS);
    }, this.host.nativeElement);
  }
}
