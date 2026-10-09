import { TestBed } from '@angular/core/testing';
import { BrandWipe } from './brand-wipe';

describe('BrandWipe', () => {
  it('stacks two-line English over Hindi and hides subtext when empty', async () => {
    await TestBed.configureTestingModule({ imports: [BrandWipe] }).compileComponents();
    const fixture = TestBed.createComponent(BrandWipe);
    fixture.componentInstance.textA = 'G Pandey Trust';
    fixture.componentInstance.textB = 'जी पांडे ट्रस्ट';
    fixture.componentInstance.subtext = '';
    fixture.componentInstance.duration = 4;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const a = Array.from(el.querySelectorAll('.wipe__layer--a .wipe__line')).map((n) =>
      n.textContent?.trim(),
    );
    const b = Array.from(el.querySelectorAll('.wipe__layer--b .wipe__line')).map((n) =>
      n.textContent?.trim(),
    );
    expect(a).toEqual(['G Pandey', 'Trust']);
    expect(b).toEqual(['जी पांडे', 'ट्रस्ट']);
    expect(el.querySelector('.wipe__sub')).toBeNull();
    expect(
      (el.querySelector('.wipe') as HTMLElement).style.getPropertyValue('--wipe-duration'),
    ).toBe('4s');
    expect(el.querySelector('.wipe')?.classList.contains('wipe--from-hi')).toBe(false);
    expect(el.querySelector('.wipe')?.classList.contains('wipe--en')).toBe(false);
    fixture.componentRef.setInput('language', 'hi');
    fixture.detectChanges();
    expect(el.querySelector('.wipe')?.classList.contains('wipe--from-hi')).toBe(true);
    expect(el.querySelector('.wipe')?.classList.contains('wipe--hi')).toBe(false);
    expect(el.querySelector('.wipe__stack')).toBeTruthy();
  });
});
