import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  it('renders the trust name and navigation', () => {
    expect(el.querySelector('.brand__name')?.textContent).toContain('G Pandey Trust');
    const links = Array.from(el.querySelectorAll('.nav__pill')).map((a) => a.textContent?.trim());
    expect(links).toEqual(['Home', 'About Us', 'Contact Us']);
  });

  it('renders the donate call to action and about copy', () => {
    expect(el.querySelector('.donate h2')?.textContent).toContain('Donate For Good Cause');
    expect(el.querySelector('.donate-btn')?.textContent).toContain('DONATE HERE');
    expect(el.querySelector('.donate__about')?.textContent).toContain('Binod Kumar Pandey');
  });

  it('renders the three programme sections, stats and gallery', () => {
    expect(el.querySelectorAll('.feature').length).toBe(3);
    expect(el.querySelectorAll('.stats__item').length).toBe(3);
    expect(el.querySelectorAll('.recognition').length).toBe(2);
    expect(el.querySelectorAll('.gallery__grid li').length).toBe(12);
  });

  it('toggles the mobile menu', async () => {
    const btn = el.querySelector<HTMLButtonElement>('.menu-toggle')!;
    btn.click();
    TestBed.tick();
    expect(el.querySelector('.nav')?.classList.contains('nav--open')).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });
});
