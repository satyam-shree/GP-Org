import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { skip } from 'rxjs';
import { PolaroidStack, PolaroidPhoto } from '../polaroid-stack/polaroid-stack';
import { SiteLanguage } from '../site-language';

interface Feature {
  title: string;
  body: string;
  image: string;
  alt: string;
  uncropped?: boolean;
}

interface Stat {
  target: number;
  label: string;
}

interface GalleryItem {
  src: string;
  alt: string;
}

@Component({
  imports: [RouterLink, PolaroidStack],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  private readonly route = inject(ActivatedRoute);
  private readonly viewport = inject(ViewportScroller);
  private readonly destroyRef = inject(DestroyRef);
  private readonly statsRoot = viewChild<ElementRef<HTMLElement>>('statsRoot');
  private readonly siteLang = inject(SiteLanguage);

  private readonly quotes = {
    hi: ['फल की कामना न रखने वाला', 'शास्त्रविधि से कर्तव्य मानकर किया गया यज्ञ'],
    en: ['Duty without desire for its fruit', 'as taught in scripture'],
  } as const;

  protected readonly quoteLines = computed(() => this.quotes[this.siteLang.lang()]);
  protected readonly quoteLang = computed(() => this.siteLang.lang());

  protected readonly heroSlides = [
    {
      src: 'images/hero.jpg',
      alt: 'Children reaching out their hands as a volunteer in saffron robes holds a bag of grain',
    },
    {
      src: 'images/hero-2.png',
      alt: 'Collage of food distributions, ration kits, and schoolchildren at Trust camps',
    },
    {
      src: 'images/hero-3.png',
      alt: 'Children sharing a meal at a food camp beside schoolgirls studying outdoors',
    },
  ] as const;

  protected readonly awardPhotos: PolaroidPhoto[] = [
    {
      src: 'images/award-eduboost-photo.jpg',
      alt: 'Three people holding Edu-Boost scholarship booklets in front of an office building',
      rotate: -1,
    },
    {
      src: 'images/hero.jpg',
      alt: 'Children reaching out their hands as a volunteer in saffron robes holds a bag of grain',
      rotate: 2.2,
    },
    {
      src: 'images/camp-group.jpg',
      alt: 'Volunteers and villagers gathered outdoors at a training camp',
      rotate: -3,
    },
    {
      src: 'images/meetup.jpg',
      alt: 'Two men standing side by side at a community meet-up',
      rotate: 2.4,
    },
  ];

  protected readonly heroIndex = signal(0);
  private heroTimer?: ReturnType<typeof setInterval>;
  private heroPaused = false;

  protected readonly fields = [
    {
      id: 'education',
      label: 'Education',
      color: '#4dbdc4',
      src: 'images/education.webp',
    },
    { id: 'health', label: 'Health', color: '#f3b3c0', src: 'images/health.webp' },
    {
      id: 'livelihood',
      label: 'Livelihood',
      color: '#7cbe4e',
      src: 'images/livelihood.webp',
    },
    {
      id: 'protection',
      label: 'Protection',
      color: '#e08a48',
      src: 'images/protection.webp',
    },
    {
      id: 'humanitarian',
      label: 'Humanitarian',
      color: '#c19ad6',
      src: 'images/humanitarian.webp',
    },
  ] as const;

  protected readonly campText =
    'We as a NGO held up many camps to train, educate and motivate people for free. We give computer, handloom and many other training. We also held camps to motivate and cheer up people.';

  protected readonly features: Feature[] = [
    {
      title: 'Motivational & Training Camp',
      body: this.campText,
      image: 'images/camp-group.jpg',
      alt: 'Volunteers and villagers gathered outdoors at a training camp',
    },
    {
      title: 'Great meet-up with Name name',
      body: this.campText,
      image: 'images/meetup.jpg',
      alt: 'Two men standing side by side at a community meet-up',
    },
    {
      title: 'Public food camp & Ration distribution',
      body: 'We held free food camps tons of times, wherever we were needed, and we also deliver free raw ration to the needy at their doorstep. Our delivery partners and warriors are always there, even in floods, corona or anything else.',
      image: 'images/food-van.jpg',
      alt: 'Trust outreach van with a red banner and a volunteer standing beside it',
      uncropped: true,
    },
  ];

  protected readonly stats: Stat[] = [
    { target: 70, label: 'Helping and training camps' },
    { target: 1000, label: 'Educational and Medical support' },
    { target: 9000, label: 'Happy faces and stomachs' },
  ];

  protected readonly shown = this.stats.map(() => signal(0));
  protected readonly statsStarted = signal(false);

  protected readonly recognitions = [
    {
      title: 'Media Coverage & Recognition',
      body: 'We are happy to share that we got some media coverage and recognition from some channels for holding a motivational camp and felicitation ceremony.',
    },
    {
      title: 'Appreciation & Recognition',
      body: 'We got great appreciation and recognition for our food camp and for our warriors, who delivered food, raw ration and medicines at the doorstep of the needy, even during covid.',
    },
  ];

  protected readonly gallery: GalleryItem[] = [
    { src: 'images/gallery-6.jpg', alt: 'Children sitting in a row sharing a meal' },
    { src: 'images/gallery-11.jpg', alt: 'Villagers receiving white sacks of ration' },
    { src: 'images/gallery-4.jpg', alt: 'Volunteers gathered behind a table with tabla' },
    { src: 'images/gallery-3.jpg', alt: 'Outdoor event under a red banner' },
    { src: 'images/gallery-1.jpg', alt: 'A young boy holding a bowl of food' },
    { src: 'images/gallery-5.jpg', alt: 'Outreach van with a red banner on the hood' },
    { src: 'images/gallery-2.jpg', alt: 'Ceremonial fire during a community ritual' },
    { src: 'images/gallery-7.jpg', alt: 'Volunteers packing bags of grain' },
    { src: 'images/gallery-8.jpg', alt: 'Ration being handed out to families' },
    { src: 'images/gallery-9.jpg', alt: 'Families queueing for a food distribution' },
    { src: 'images/gallery-10.jpg', alt: 'Ration distribution next to a haystack' },
    { src: 'images/gallery-12.jpg', alt: 'Volunteers unloading supplies from a truck' },
  ];

  private observer?: IntersectionObserver;
  private raf = 0;
  private counting = false;

  constructor() {
    afterNextRender(() => {
      this.scrollToFragment(this.route.snapshot.fragment);
      this.setupCountUp();
      this.startHero();
    });
    this.route.fragment.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      this.scrollToFragment(fragment);
    });
    this.destroyRef.onDestroy(() => {
      this.stopHero();
      this.observer?.disconnect();
      if (this.raf) {
        cancelAnimationFrame(this.raf);
      }
    });
  }

  protected pauseHero(): void {
    this.heroPaused = true;
  }

  protected resumeHero(): void {
    this.heroPaused = false;
  }

  protected goToHero(index: number): void {
    this.heroIndex.set(index);
    this.restartHero();
  }

  private scrollToFragment(fragment: string | null): void {
    if (fragment) {
      this.viewport.scrollToAnchor(fragment);
    }
  }

  private setupCountUp(): void {
    if (this.prefersReducedMotion()) {
      this.jumpToFinal();
      return;
    }

    const el = this.statsRoot()?.nativeElement;
    if (!el) {
      return;
    }

    const startIfVisible = (visible: boolean) => {
      if (!visible || this.counting) {
        return;
      }
      this.counting = true;
      this.observer?.disconnect();
      this.animate();
    };

    if (typeof IntersectionObserver === 'undefined') {
      startIfVisible(this.isInViewport(el));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        startIfVisible(
          entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0),
        );
      },
      { threshold: [0, 0.15, 0.35], root: null, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(el);
    startIfVisible(this.isInViewport(el));
  }

  private animate(): void {
    this.statsStarted.set(true);
    const start = performance.now();
    const duration = 2000;
    const targets = this.stats.map((s) => s.target);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      for (let i = 0; i < targets.length; i++) {
        this.shown[i].set(Math.round(targets[i] * eased));
      }
      if (t < 1) {
        this.raf = requestAnimationFrame(tick);
      }
    };

    this.raf = requestAnimationFrame(tick);
  }

  private jumpToFinal(): void {
    this.statsStarted.set(true);
    this.counting = true;
    this.stats.forEach((stat, i) => this.shown[i].set(stat.target));
  }

  private isInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return rect.bottom > 0 && rect.top < vh * 0.92 && rect.height > 0;
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
  }

  private startHero(): void {
    if (this.heroTimer || this.prefersReducedMotion()) {
      return;
    }
    this.heroTimer = setInterval(() => {
      if (!this.heroPaused) {
        this.heroIndex.update((i) => (i + 1) % this.heroSlides.length);
      }
    }, 5000);
  }

  private stopHero(): void {
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
      this.heroTimer = undefined;
    }
  }

  private restartHero(): void {
    this.stopHero();
    this.startHero();
  }
}
