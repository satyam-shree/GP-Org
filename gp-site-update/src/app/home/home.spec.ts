import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Home } from './home';
import { SiteLanguage } from '../site-language';

describe('Home stats count-up', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
        onchange: null,
      }),
    });
  });

  it('renders three hero slides and stays on the first when motion is reduced', async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const srcs = Array.from(el.querySelectorAll('.hero__img')).map((n) => n.getAttribute('src'));
    expect(srcs).toEqual(['images/hero.jpg', 'images/hero-2.png', 'images/hero-3.png']);
    expect(el.querySelectorAll('.hero__dot').length).toBe(3);
    expect(el.querySelector('.hero__dot.is-on')?.getAttribute('aria-label')).toBe('Show photo 1');
    const dots = el.querySelectorAll('.hero__dot') as NodeListOf<HTMLButtonElement>;
    dots[1].click();
    fixture.detectChanges();
    expect(el.querySelector('.hero__dot.is-on')?.getAttribute('aria-label')).toBe('Show photo 2');
    expect(el.querySelector('.quote')?.previousElementSibling?.classList.contains('hero')).toBe(
      true,
    );
    expect(el.querySelector('.award')?.previousElementSibling?.classList.contains('fields')).toBe(
      true,
    );
    expect(el.querySelector('.award__title')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Making Efforts That Count',
    );
    expect(el.querySelector('.award__accent')?.textContent?.trim()).toBe('Efforts');
    expect(el.querySelectorAll('app-polaroid-stack .polaroid').length).toBe(4);
  });

  it('shows the English tagline by default and Hindi after language is set', async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const readLines = () =>
      Array.from(
        fixture.nativeElement.querySelectorAll('.quote__line') as NodeListOf<HTMLElement>,
      ).map((el) => el.textContent?.trim());
    expect(readLines()).toEqual(['Duty without desire for its fruit', 'as taught in scripture']);
    TestBed.inject(SiteLanguage).set('hi');
    fixture.detectChanges();
    expect(readLines()).toEqual([
      'फल की कामना न रखने वाला',
      'शास्त्रविधि से कर्तव्य मानकर किया गया यज्ञ',
    ]);
  });

  it('shows the final numbers immediately when motion is reduced', async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const values = Array.from(
      fixture.nativeElement.querySelectorAll('.count-up') as NodeListOf<HTMLElement>,
    ).map((el) => el.textContent?.trim());
    expect(values).toEqual(['70+', '1000+', '9000+']);
  });
});
