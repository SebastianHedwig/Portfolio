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
import { ContactStageContentComponent } from './components/contact-stage-content/contact-stage-content.component';
import { ContactStageFormComponent } from './components/contact-stage-form/contact-stage-form.component';
import { CONTACT_CONTENT } from './contact.data';

const CONTACT_REVEALS: readonly ScrollRevealConfig[] = [
  {
    selector: '.contact-stage__column--content',
  },
  {
    selector: '.contact-stage__form',
  },
] as const;

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ContactStageContentComponent, ContactStageFormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnDestroy {
  readonly content = CONTACT_CONTENT;

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
