import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PLACE } from './contact.constants';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-contact',
  styleUrl: './contact.scss',
  templateUrl: './contact.html',
})
export class Contact {
  private readonly fb = inject(FormBuilder);

  protected readonly email = CONTACT_EMAIL;
  protected readonly phone = CONTACT_PHONE;
  protected readonly place = CONTACT_PLACE;
  protected readonly submitted = signal(false);
  protected readonly sent = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^[0-9+\-\s()xX]{8,20}$/)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected invalid(control: 'name' | 'email' | 'phone' | 'message'): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, phone, message } = this.form.getRawValue();
    const body = [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : null, '', message]
      .filter((line) => line !== null)
      .join('\n');

    const mailto = `mailto:${this.email}?subject=${encodeURIComponent(
      'Message from the G Pandey Trust website',
    )}&body=${encodeURIComponent(body)}`;

    window.location.assign(mailto);
    this.sent.set(true);
  }

  protected reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.sent.set(false);
  }
}
