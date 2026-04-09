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

@Component({
  selector: 'app-references',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss',
})
export class ReferencesComponent implements OnDestroy {
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
      initScrollReveals(this.host.nativeElement);
    }, this.host.nativeElement);
  }
}
