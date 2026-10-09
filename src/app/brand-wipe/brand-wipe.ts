import { Component, Input, effect, input, signal, untracked } from '@angular/core';

@Component({
  selector: 'app-brand-wipe',
  styleUrl: './brand-wipe.scss',
  templateUrl: './brand-wipe.html',
})
export class BrandWipe {
  @Input() textA = 'G Pandey Trust';
  @Input() textB = '';
  @Input() subtext = '';
  @Input() duration = 4;
  readonly language = input<'en' | 'hi'>('en');

  protected readonly cycle = signal(0);
  protected readonly startAt = signal<'en' | 'hi'>('en');
  private seenLang = false;

  constructor() {
    effect(() => {
      const lang = this.language();
      untracked(() => {
        this.startAt.set(lang);
        if (this.seenLang) {
          this.cycle.update((n) => n + 1);
        }
        this.seenLang = true;
      });
    });
  }

  protected split(text: string): string[] {
    const trimmed = text.trim();
    const i = trimmed.lastIndexOf(' ');
    if (i <= 0) {
      return trimmed ? [trimmed] : [];
    }
    return [trimmed.slice(0, i), trimmed.slice(i + 1)];
  }

  protected isHindi(text: string): boolean {
    return /[\u0900-\u097F]/.test(text);
  }
}
