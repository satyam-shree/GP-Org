import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { App } from './app';
import { routes } from './app.routes';
import { SiteLanguage } from './site-language';

describe('App', () => {
  let el: HTMLElement;
  let fixture: ReturnType<typeof TestBed.createComponent<App>>;

  beforeEach(async () => {
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

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    TestBed.inject(SiteLanguage).set('en');
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it('renders the trust name and navigation', () => {
    const english = Array.from(el.querySelectorAll('.wipe__layer--a .wipe__line')).map((n) =>
      n.textContent?.trim(),
    );
    const hindi = Array.from(el.querySelectorAll('.wipe__layer--b .wipe__line')).map((n) =>
      n.textContent?.trim(),
    );
    expect(english).toEqual(['G Pandey', 'Trust']);
    expect(hindi).toEqual(['जी पांडे', 'ट्रस्ट']);
    const wipe = el.querySelector('.wipe');
    expect(wipe?.classList.contains('wipe--from-hi')).toBe(false);
    expect(wipe?.classList.contains('wipe--en')).toBe(false);
    expect(wipe?.classList.contains('wipe--hi')).toBe(false);
    const langs = Array.from(el.querySelectorAll('.site-header__langs button')).map((n) =>
      n.textContent?.trim(),
    );
    expect(langs).toEqual(['English', 'Hindi']);
    expect(el.querySelector('.site-header__langs')?.textContent).not.toContain('Contact:');
    expect(el.querySelector('.site-header__strip .site-header__langs')).toBeTruthy();
    const marquee = el.querySelector('.site-header__marquee-track');
    expect(marquee?.textContent).toContain(
      'Gangeshwar Pandey Trust is registered under sections 12A & 80G of the Income Tax Act, 1961',
    );
    expect(marquee?.textContent).toContain('click here to visit all certificates');
    const certLink = el.querySelector('.site-header__marquee-link');
    expect(certLink?.getAttribute('href')).toBe('/contact');
    expect(certLink?.textContent?.trim()).toBe('click here to visit all certificates');
    const links = Array.from(el.querySelectorAll('.nav__pill')).map((a) => a.textContent?.trim());
    expect(links).toEqual(['Home', 'About Us', 'Contact Us']);
  });

  it('keeps the title wipe looping after Hindi is selected in the strip', () => {
    const hindiBtn = Array.from(el.querySelectorAll('.site-header__langs button')).find(
      (n) => n.textContent?.trim() === 'Hindi',
    ) as HTMLButtonElement;
    hindiBtn.click();
    fixture.detectChanges();
    const wipe = el.querySelector('.wipe');
    expect(wipe?.classList.contains('wipe--from-hi')).toBe(true);
    expect(wipe?.classList.contains('wipe--hi')).toBe(false);
    expect(el.querySelector('.wipe__layer--a')).toBeTruthy();
    expect(el.querySelector('.wipe__layer--b')).toBeTruthy();
    expect(el.querySelector('.quote')?.textContent).toContain('फल की कामना न रखने वाला');

    const englishBtn = Array.from(el.querySelectorAll('.site-header__langs button')).find(
      (n) => n.textContent?.trim() === 'English',
    ) as HTMLButtonElement;
    englishBtn.click();
    fixture.detectChanges();
    expect(el.querySelector('.wipe')?.classList.contains('wipe--from-hi')).toBe(false);
    expect(el.querySelector('.wipe__layer--a')).toBeTruthy();
  });

  it('renders the donate call to action and about copy on home', () => {
    expect(el.querySelector('.donate h2')?.textContent).toContain('Donate For Good Cause');
    expect(el.querySelector('.donate__blurb')?.textContent).toContain(
      'works on food camps and ration distribution',
    );
    expect(el.querySelector('.donate-btn')?.textContent).toContain('DONATE HERE');
    expect(el.querySelector('.donate__banner')).toBeTruthy();
    expect(el.querySelector('.jayate__title')?.textContent).toContain('Jeevan Jayate');
    expect(el.querySelector('.jayate')?.textContent).toContain('Binod Kumar Pandey');
    expect(el.querySelector('.jayate')?.textContent).toContain('flood relief, Covid support');
    expect(el.querySelector('.jayate')?.textContent).toContain('passion and innovation');
    expect(el.querySelectorAll('.jayate__body p').length).toBe(3);
    expect(el.querySelector('.jayate__more')?.textContent).toContain('Read More...');
    expect(el.querySelector('.jayate__more')?.getAttribute('href')).toBe('/contact');
    expect(el.querySelector('.donate__about')).toBeNull();
    expect(el.querySelector('.fields__title')?.textContent).toContain('OUR FIELDS OF WORK');
    expect(
      Array.from(el.querySelectorAll('.fields__label')).map((n) => n.textContent?.trim()),
    ).toEqual(['Education', 'Health', 'Livelihood', 'Protection', 'Humanitarian']);
    expect(el.querySelectorAll('.fields__icon').length).toBe(5);
    expect(el.querySelector('svg.fields__icon')).toBeNull();
    expect(
      Array.from(el.querySelectorAll('.fields__icon')).map((n) => n.getAttribute('src')),
    ).toEqual([
      'images/education.webp',
      'images/health.webp',
      'images/livelihood.webp',
      'images/protection.webp',
      'images/humanitarian.webp',
    ]);
    const award = el.querySelector('.award');
    expect(award?.previousElementSibling?.classList.contains('fields')).toBe(true);
    expect(el.querySelector('#award-title')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Making Efforts That Count',
    );
    expect(el.querySelector('#award-title br')).toBeTruthy();
    expect(el.querySelector('.award__accent')?.textContent?.trim()).toBe('Efforts');
    expect(
      el.querySelector('.award__title')?.nextElementSibling?.classList.contains('award__body'),
    ).toBe(true);
    expect(el.querySelector('.award__body')?.textContent).toContain('Indian CSR Awards 2024');
    expect(el.querySelector('app-polaroid-stack')).toBeTruthy();
    expect(el.querySelectorAll('app-polaroid-stack .polaroid img').length).toBe(4);
    expect(el.querySelector('app-polaroid-stack .polaroid--front img')?.getAttribute('src')).toBe(
      'images/award-eduboost-photo.jpg',
    );
  });

  it('renders the three programme sections, stats and gallery', () => {
    expect(el.querySelectorAll('.feature').length).toBe(3);
    expect(el.querySelectorAll('.stats__item').length).toBe(3);
    expect(el.querySelectorAll('.recognition').length).toBe(2);
    expect(el.querySelectorAll('.gallery__grid li').length).toBe(12);
  });

  it('keeps the header unshaded at the top and marks it scrolled after scrolling', async () => {
    expect(el.querySelector('.site-header')?.classList.contains('site-header--scrolled')).toBe(
      false,
    );
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 40 });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('.site-header')?.classList.contains('site-header--scrolled')).toBe(
      true,
    );
  });

  it('toggles the mobile menu', async () => {
    const btn = el.querySelector<HTMLButtonElement>('.menu-toggle')!;
    btn.click();
    fixture.detectChanges();
    expect(el.querySelector('.nav')?.classList.contains('nav--open')).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('navigates to the contact page from the header', async () => {
    const router = TestBed.inject(Router);
    const title = TestBed.inject(Title);
    await router.navigateByUrl('/contact');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('#contact-title')?.textContent).toContain('Contact Us');
    expect(title.getTitle()).toContain('Contact Us');
  });
});
