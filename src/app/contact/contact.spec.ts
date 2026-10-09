import { TestBed } from '@angular/core/testing';
import { Contact } from './contact';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PLACE } from './contact.constants';

describe('Contact', () => {
  let el: HTMLElement;
  let fixture: ReturnType<typeof TestBed.createComponent<Contact>>;
  let assigned: string | undefined;

  beforeEach(async () => {
    assigned = undefined;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { assign: (url: string) => (assigned = url) },
    });

    await TestBed.configureTestingModule({ imports: [Contact] }).compileComponents();
    fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  it('renders the heading, intro and placeholder details', () => {
    expect(el.querySelector('#contact-title')?.textContent).toContain('Contact Us');
    expect(el.textContent).toContain(CONTACT_PHONE);
    expect(el.textContent).toContain(CONTACT_PLACE);
    expect(el.textContent).toContain(CONTACT_EMAIL);
  });

  it('shows validation messages when submitted empty', async () => {
    el.querySelector<HTMLButtonElement>('.contact__submit')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.textContent).toContain('Please enter your name.');
    expect(el.textContent).toContain('Please enter a valid email address.');
    expect(assigned).toBeUndefined();
  });

  it('opens a prefilled mailto and shows success after a valid submit', async () => {
    const inputs = el.querySelectorAll('input');
    const textarea = el.querySelector('textarea')!;
    setValue(inputs[0], 'Asha');
    setValue(inputs[1], 'asha@example.com');
    setValue(inputs[2], '9812345678');
    setValue(textarea, 'I would like to volunteer at a food camp.');
    fixture.detectChanges();

    el.querySelector<HTMLFormElement>('form')!.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    expect(assigned).toMatch(new RegExp(`^mailto:${CONTACT_EMAIL}\\?`));
    expect(assigned).toContain(encodeURIComponent('Asha'));
    expect(el.querySelector('.contact__success')?.textContent).toContain('Thank you');
  });
});

function setValue(node: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  node.value = value;
  node.dispatchEvent(new Event('input', { bubbles: true }));
}
