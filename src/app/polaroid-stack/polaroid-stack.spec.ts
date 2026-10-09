import { TestBed } from '@angular/core/testing';
import { PolaroidStack, PolaroidPhoto } from './polaroid-stack';

const photos: PolaroidPhoto[] = [
  { src: 'images/a.jpg', alt: 'A', rotate: -1 },
  { src: 'images/b.jpg', alt: 'B', rotate: 2 },
  { src: 'images/c.jpg', alt: 'C', rotate: -3 },
];

describe('PolaroidStack', () => {
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

  async function create() {
    await TestBed.configureTestingModule({ imports: [PolaroidStack] }).compileComponents();
    const fixture = TestBed.createComponent(PolaroidStack);
    fixture.componentRef.setInput('photos', photos);
    fixture.componentRef.setInput('label', 'Award photos');
    fixture.detectChanges();
    return fixture;
  }

  it('renders polaroid cards with bound src, alt and rotation', async () => {
    const fixture = await create();
    const el = fixture.nativeElement as HTMLElement;
    const cards = el.querySelectorAll('.polaroid');
    expect(cards.length).toBe(3);
    expect(el.querySelector('[aria-label="Award photos"]')).toBeTruthy();
    const imgs = Array.from(el.querySelectorAll('.polaroid img'));
    expect(imgs.map((n) => n.getAttribute('src'))).toEqual([
      'images/a.jpg',
      'images/b.jpg',
      'images/c.jpg',
    ]);
    expect(imgs[0].getAttribute('alt')).toBe('A');
    expect((cards[0] as HTMLElement).style.getPropertyValue('--rot')).toBe('-1deg');
    expect((cards[1] as HTMLElement).style.getPropertyValue('--rot')).toBe('2deg');
    expect(cards[0].classList.contains('polaroid--front')).toBe(true);
  });

  it('moves the front card to the back when cycled with reduced motion', async () => {
    const fixture = await create();
    fixture.componentInstance.cycle();
    fixture.detectChanges();
    const srcs = Array.from(fixture.nativeElement.querySelectorAll('.polaroid img')).map((n) =>
      (n as HTMLImageElement).getAttribute('src'),
    );
    expect(srcs).toEqual(['images/b.jpg', 'images/c.jpg', 'images/a.jpg']);
    expect(fixture.nativeElement.querySelector('.polaroid--front img')?.getAttribute('src')).toBe(
      'images/b.jpg',
    );
  });
});
