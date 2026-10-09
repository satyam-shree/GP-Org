import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';
import { BrandWipe } from './brand-wipe/brand-wipe';
import { CERTIFICATES_HREF } from './contact/contact.constants';
import { SiteLang, SiteLanguage } from './site-language';

@Component({
  imports: [BrandWipe, NgTemplateOutlet, RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly year = new Date().getFullYear();
  private readonly siteLang = inject(SiteLanguage);
  protected readonly lang = this.siteLang.lang;

  protected readonly certificatesHref = CERTIFICATES_HREF;

  protected readonly navLinks: { label: string; path: string; fragment?: string }[] = [
    { label: 'Home', path: '/', fragment: 'home' },
    { label: 'About Us', path: '/', fragment: 'about' },
    { label: 'Contact Us', path: '/contact' },
  ];

  constructor() {
    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 12);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.menuOpen.set(false);
        queueMicrotask(() => this.scrolled.set(window.scrollY > 12));
      });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected setLang(next: SiteLang): void {
    this.siteLang.set(next);
  }
}
