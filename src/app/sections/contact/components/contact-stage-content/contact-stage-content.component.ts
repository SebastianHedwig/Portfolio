import { ChangeDetectionStrategy, Component, input } from '@angular/core'

import { type ContactContent } from '../../contact.data'

@Component({
  selector: 'app-contact-stage-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './contact-stage-content.component.html',
  styleUrl: './contact-stage-content.component.scss',
  host: {
    class: 'stage-shell__column contact-stage__column contact-stage__column--content',
  },
})
export class ContactStageContentComponent {
  readonly content = input.required<ContactContent>()
}
