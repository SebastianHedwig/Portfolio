import { finalize } from 'rxjs'
import { DOCUMENT } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core'
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
import { ContactPayload, ContactService } from '../../../../services/contact.service'

const NAME_MAX_LENGTH = 50
const SUBJECT_MAX_LENGTH = 100
const MESSAGE_MIN_LENGTH = 10
const MESSAGE_MAX_LENGTH = 800
const TOAST_DURATION_MS = 2500
const TOAST_EXIT_DURATION_MS = 260
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
export class ContactStageFormComponent implements OnDestroy {
  private readonly contactService = inject(ContactService)
  private readonly document = inject(DOCUMENT)
  private toastElement: HTMLDivElement | null = null
  private toastTimeoutId: number | null = null
  private toastRemoveTimeoutId: number | null = null

  readonly isSubmitting = signal(false)
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

    this.isSubmitting.set(true)
    this.hideToast()

    const payload: ContactPayload = {
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      subject: this.form.controls.subject.value,
      message: this.form.controls.message.value,
      honeypot: '',
    }

    this.contactService.sendContact(payload).pipe(
      finalize(() => {
        this.isSubmitting.set(false)
      })
    ).subscribe({
      next: () => {
        this.form.reset()
        this.showToast(this.content().toast.success, 'success')
      },
      error: () => {
        this.showToast(this.content().toast.error, 'error')
      },
    })
  }

  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty)
  }

  ngOnDestroy(): void {
    this.removeToast()
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.removeToast()
    this.toastElement = this.document.createElement('div')
    this.toastElement.className = `contact-stage-toast contact-stage-toast--${type}`
    this.toastElement.role = 'status'
    this.toastElement.ariaLive = 'polite'
    this.toastElement.textContent = message
    this.document.body.appendChild(this.toastElement)

    requestAnimationFrame(() => {
      this.toastElement?.classList.add('contact-stage-toast--visible')
    })

    this.toastTimeoutId = window.setTimeout(() => {
      this.hideToast()
    }, TOAST_DURATION_MS)
  }

  private hideToast(): void {
    this.clearToastTimeout()
    this.clearToastRemoveTimeout()

    if (!this.toastElement) {
      return
    }

    const toast = this.toastElement
    toast.classList.remove('contact-stage-toast--visible')
    this.toastRemoveTimeoutId = window.setTimeout(() => {
      toast.remove()

      if (this.toastElement === toast) {
        this.toastElement = null
      }

      this.toastRemoveTimeoutId = null
    }, TOAST_EXIT_DURATION_MS)
  }

  private clearToastTimeout(): void {
    if (this.toastTimeoutId === null) {
      return
    }

    window.clearTimeout(this.toastTimeoutId)
    this.toastTimeoutId = null
  }

  private clearToastRemoveTimeout(): void {
    if (this.toastRemoveTimeoutId === null) {
      return
    }

    window.clearTimeout(this.toastRemoveTimeoutId)
    this.toastRemoveTimeoutId = null
  }

  private removeToast(): void {
    this.clearToastTimeout()
    this.clearToastRemoveTimeout()
    this.toastElement?.remove()
    this.toastElement = null
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
