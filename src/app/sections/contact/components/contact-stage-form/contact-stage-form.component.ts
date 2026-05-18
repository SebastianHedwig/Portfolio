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
    this.sendForm()
  }

  private sendForm(): void {
    this.contactService.sendContact(this.createPayload()).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: () => this.handleSubmitSuccess(),
      error: () => this.showToast(this.content().toast.error, 'error'),
    })
  }

  private createPayload(): ContactPayload {
    return {
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      subject: this.form.controls.subject.value,
      message: this.form.controls.message.value,
      honeypot: '',
      language: this.content().language,
    }
  }

  private handleSubmitSuccess(): void {
    this.form.reset()
    this.showToast(this.content().toast.success, 'success')
  }

  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty)
  }

  showValid(control: AbstractControl): boolean {
    return control.valid && (control.touched || control.dirty)
  }

  ngOnDestroy(): void {
    this.removeToast()
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.removeToast()
    this.toastElement = this.createToastElement(message, type)
    this.document.body.appendChild(this.toastElement)
    requestAnimationFrame(() => this.showToastElement())
    this.toastTimeoutId = window.setTimeout(() => this.hideToast(), TOAST_DURATION_MS)
  }

  private createToastElement(
    message: string,
    type: 'success' | 'error',
  ): HTMLDivElement {
    const toast = this.document.createElement('div')
    toast.className = `contact-stage-toast contact-stage-toast--${type}`
    toast.role = 'status'
    toast.ariaLive = 'polite'
    toast.textContent = message
    return toast
  }

  private showToastElement(): void {
    this.toastElement?.classList.add('contact-stage-toast--visible')
  }

  private hideToast(): void {
    this.clearToastTimeout()
    this.clearToastRemoveTimeout()

    if (!this.toastElement) return

    const toast = this.toastElement
    toast.classList.remove('contact-stage-toast--visible')
    this.scheduleToastRemoval(toast)
  }

  private scheduleToastRemoval(toast: HTMLDivElement): void {
    this.toastRemoveTimeoutId = window.setTimeout(
      () => this.removeHiddenToast(toast),
      TOAST_EXIT_DURATION_MS,
    )
  }

  private removeHiddenToast(toast: HTMLDivElement): void {
    toast.remove()
    if (this.toastElement === toast) {
      this.toastElement = null
    }
    this.toastRemoveTimeoutId = null
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

  if (!value) return null

  const parts = value.split('@')
  if (parts.length !== 2) return { email: true }

  const [localPart, domain] = parts as [string, string]
  if (hasInvalidEmailParts(localPart, domain)) return { email: true }
  if (hasBlockedEmailDomain(domain)) return { blockedDomain: true }
  return null
}

function hasInvalidEmailParts(localPart: string, domain: string): boolean {
  return hasInvalidLocalPart(localPart) || hasInvalidDomain(domain)
}

function hasInvalidLocalPart(localPart: string): boolean {
  return !localPart
    || localPart.length > 64
    || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)
}

function hasInvalidDomain(domain: string): boolean {
  const labels = domain.split('.')
  return domain.length > 253
    || labels.length < 2
    || labels.some((label) => hasInvalidDomainLabel(label))
    || !/^[A-Za-z]{2,63}$/.test(labels[labels.length - 1])
}

function hasInvalidDomainLabel(label: string): boolean {
  return label.length === 0
    || label.length > 63
    || !/^[A-Za-z0-9-]+$/.test(label)
    || label.startsWith('-')
    || label.endsWith('-')
}

function hasBlockedEmailDomain(domain: string): boolean {
  const normalizedDomain = domain.toLowerCase()
  return BLOCKED_EMAIL_DOMAINS.has(normalizedDomain)
    || isReservedDomain(normalizedDomain)
    || isTemporaryMailDomain(normalizedDomain)
}

function isReservedDomain(domain: string): boolean {
  return domain.endsWith('.invalid')
    || domain.endsWith('.example')
    || domain.startsWith('test.')
    || domain.startsWith('fake.')
}

function isTemporaryMailDomain(domain: string): boolean {
  return domain.includes('tempmail')
    || domain.includes('mailinator')
    || domain.includes('guerrillamail')
}
