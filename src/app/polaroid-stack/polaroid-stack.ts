import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';

export interface PolaroidPhoto {
  src: string;
  alt: string;
  rotate?: number;
}

const DEFAULT_ROTATES = [-1, 2.2, -3, 3.2, -2.4];

@Component({
  selector: 'app-polaroid-stack',
  styleUrl: './polaroid-stack.scss',
  templateUrl: './polaroid-stack.html',
})
export class PolaroidStack {
  private readonly destroyRef = inject(DestroyRef);

  readonly photos = input<readonly PolaroidPhoto[]>([]);
  readonly intervalMs = input(3600);
  readonly label = input('Photo stack');

  private readonly order = signal<number[]>([]);
  protected readonly leaving = signal(false);
  private paused = false;
  private animating = false;
  private timer?: ReturnType<typeof setInterval>;
  private leaveFallback?: ReturnType<typeof setTimeout>;

  protected readonly cards = computed(() => {
    const photos = this.photos();
    return this.order()
      .map((photoIndex, pos) => {
        const photo = photos[photoIndex];
        if (!photo) {
          return null;
        }
        return {
          src: photo.src,
          alt: photo.alt,
          rotate: photo.rotate ?? DEFAULT_ROTATES[pos % DEFAULT_ROTATES.length],
          pos,
        };
      })
      .filter((card): card is NonNullable<typeof card> => card !== null);
  });

  constructor() {
    effect(() => {
      const n = this.photos().length;
      untracked(() => {
        this.order.set(Array.from({ length: n }, (_, i) => i));
        this.leaving.set(false);
        this.animating = false;
        this.clearLeaveFallback();
      });
    });

    afterNextRender(() => this.start());
    this.destroyRef.onDestroy(() => this.stop());
  }

  protected pause(): void {
    this.paused = true;
  }

  protected resume(): void {
    this.paused = false;
  }

  protected onLeaveEnd(event: AnimationEvent, pos: number): void {
    if (pos !== 0) {
      return;
    }
    const name = event.animationName;
    if (name && name !== 'polaroid-leave' && !String(name).includes('polaroid-leave')) {
      return;
    }
    this.finishLeave();
  }

  /** Advance the stack by one photo. Used by the timer and unit tests. */
  cycle(): void {
    if (this.photos().length < 2 || this.animating || this.paused) {
      return;
    }
    if (this.prefersReducedMotion()) {
      this.rotateOrder();
      return;
    }
    this.animating = true;
    this.leaving.set(true);
    this.clearLeaveFallback();
    this.leaveFallback = setTimeout(() => this.finishLeave(), 1200);
  }

  private finishLeave(): void {
    if (!this.animating) {
      return;
    }
    this.animating = false;
    this.clearLeaveFallback();
    this.rotateOrder();
    this.leaving.set(false);
  }

  private rotateOrder(): void {
    const next = this.order();
    if (next.length >= 2) {
      this.order.set([...next.slice(1), next[0]]);
    }
  }

  private start(): void {
    this.stop();
    if (this.photos().length < 2 || this.prefersReducedMotion()) {
      return;
    }
    this.timer = setInterval(() => this.cycle(), this.intervalMs());
  }

  private stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.clearLeaveFallback();
  }

  private clearLeaveFallback(): void {
    if (this.leaveFallback) {
      clearTimeout(this.leaveFallback);
      this.leaveFallback = undefined;
    }
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
  }
}
