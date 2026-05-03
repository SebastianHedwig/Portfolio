import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms'

import { PrimaryButtonComponent } from '../../../../shared/components/primary-button/primary-button.component'
import { type ContactContent } from '../../contact.data'

const NAME_MAX_LENGTH = 50
const SUBJECT_MAX_LENGTH = 100
const MESSAGE_MIN_LENGTH = 10
const MESSAGE_MAX_LENGTH = 800
const BLOCKED_EMAIL_DOMAINS = new Set([
  'example.com',
  'example.net',
  'example.org',
  'test.com',
  'test.de',
  'fake.com',
  'invalid.com',
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'temp-mail.org',
  'tempmail.com',
  '10minutemail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
])

@Component({
  selector: 'app-contact-stage-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PrimaryButtonComponent, ReactiveFormsModule],
  templateUrl: './contact-stage-form.component.html',
  styleUrl: './contact-stage-form.component.scss',
  host: {
    class: 'stage-shell__column contact-stage__column contact-stage__form',
  },
})
export class ContactStageFormComponent {
  readonly content = input.required<ContactContent>()
  readonly nameMaxLength = NAME_MAX_LENGTH
  readonly subjectMaxLength = SUBJECT_MAX_LENGTH
  readonly messageMinLength = MESSAGE_MIN_LENGTH
  readonly messageMaxLength = MESSAGE_MAX_LENGTH
  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.maxLength(NAME_MAX_LENGTH)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, ianaEmailValidator],
    }),
    subject: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.maxLength(SUBJECT_MAX_LENGTH)],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [
        requiredTrimmed,
        Validators.minLength(MESSAGE_MIN_LENGTH),
        Validators.maxLength(MESSAGE_MAX_LENGTH),
      ],
    }),
    consent: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  })
  readonly messageValue = toSignal(this.form.controls.message.valueChanges, {
    initialValue: this.form.controls.message.value,
  })
  readonly messageLength = computed(() => this.messageValue().length)

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
  }

  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty)
  }
}

function requiredTrimmed(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { required: true }
}

function ianaEmailValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value.trim()

  if (!value) {
    return null
  }

  const parts = value.split('@')

  if (parts.length !== 2) {
    return { email: true }
  }

  const [localPart, domain] = parts

  if (!localPart || localPart.length > 64 || domain.length > 253) {
    return { email: true }
  }

  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
    return { email: true }
  }

  const labels = domain.split('.')

  if (labels.length < 2) {
    return { email: true }
  }

  if (
    labels.some((label) =>
      label.length === 0
      || label.length > 63
      || !/^[A-Za-z0-9-]+$/.test(label)
      || label.startsWith('-')
      || label.endsWith('-'),
    )
  ) {
    return { email: true }
  }

  if (!/^[A-Za-z]{2,63}$/.test(labels[labels.length - 1])) {
    return { email: true }
  }

  const normalizedDomain = domain.toLowerCase()

  if (
    BLOCKED_EMAIL_DOMAINS.has(normalizedDomain)
    || normalizedDomain.endsWith('.invalid')
    || normalizedDomain.endsWith('.example')
    || normalizedDomain.startsWith('test.')
    || normalizedDomain.startsWith('fake.')
    || normalizedDomain.includes('tempmail')
    || normalizedDomain.includes('mailinator')
    || normalizedDomain.includes('guerrillamail')
  ) {
    return { blockedDomain: true }
  }

  return null
}
