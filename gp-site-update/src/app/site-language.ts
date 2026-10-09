import { Injectable, signal } from '@angular/core';

export type SiteLang = 'en' | 'hi';

@Injectable({ providedIn: 'root' })
export class SiteLanguage {
  readonly lang = signal<SiteLang>('en');

  set(next: SiteLang): void {
    this.lang.set(next);
  }
}
