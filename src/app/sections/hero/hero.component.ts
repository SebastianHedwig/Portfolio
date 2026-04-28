import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
} from '@angular/core';

import { HeroDescriptionComponent } from './components/hero-description/hero-description.component';
import { HeroIdentityComponent } from './components/hero-identity/hero-identity.component';
import { HeroPortraitComponent } from './components/hero-portrait/hero-portrait.component';
import { LanguageStore } from '../../i18n/language.store';
import { getHeroContent } from './hero.data';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HeroDescriptionComponent,
    HeroIdentityComponent,
    HeroPortraitComponent,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly languageStore = inject(LanguageStore);
  private animationContext: { revert: () => void } | null = null;
  private isDestroyed = false;

  readonly content = computed(() => getHeroContent(this.languageStore.language()));
  readonly description = computed(() => this.content().description);
  readonly identity = computed(() => this.content().identity);
  readonly portrait = computed(() => this.content().portrait);
  readonly statementParts = computed(() => this.content().statementParts);
  readonly statementRepeats = Array.from({ length: 4 }, (_, index) => index);

  ngAfterViewInit(): void {
    this.isDestroyed = false;

    if (this.prefersReducedMotion()) {
      return;
    }

    void this.initExitAnimation();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.animationContext?.revert();
    this.animationContext = null;
  }

  private async initExitAnimation(): Promise<void> {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);

    if (this.isDestroyed) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.createExitAnimation(gsap);
  }

  private createExitAnimation(gsap: typeof import('gsap').gsap): void {
    const host = this.host.nativeElement;
    const hero = host.querySelector('.hero') as HTMLElement | null;

    if (!hero) {
      return;
    }

    this.animationContext = gsap.context(() => {
      this.fadeHeroOnExit(gsap, hero, host);
      this.shiftHeroTextOnExit(gsap, hero, host);
    }, host);
  }

  private fadeHeroOnExit(
    gsap: typeof import('gsap').gsap,
    hero: HTMLElement,
    host: HTMLElement,
  ): void {
    gsap.to(hero, {
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: this.exitTrigger(host),
    });
  }

  private shiftHeroTextOnExit(
    gsap: typeof import('gsap').gsap,
    hero: HTMLElement,
    host: HTMLElement,
  ): void {
    gsap.to(this.resolveShiftTargets(hero), {
      ease: 'none',
      scrollTrigger: this.exitTrigger(host),
      y: -54,
    });
  }

  private exitTrigger(host: HTMLElement): Record<string, unknown> {
    return {
      trigger: host,
      start: 'top -12%',
      end: 'bottom 25%',
      scrub: 0.8,
      invalidateOnRefresh: true,
    };
  }

  private resolveShiftTargets(hero: HTMLElement): HTMLElement[] {
    const selectors = [
      'app-hero-description',
      'app-hero-identity',
      '.hero__statement-band',
    ];

    return selectors
      .map((selector) => hero.querySelector(selector))
      .filter((target): target is HTMLElement => target instanceof HTMLElement);
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
