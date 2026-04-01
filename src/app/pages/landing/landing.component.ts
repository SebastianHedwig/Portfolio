import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AboutComponent } from '../../sections/about/about.component';
import { ContactComponent } from '../../sections/contact/contact.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { LegalComponent } from '../../sections/legal/legal.component';
import { ProjectsComponent } from '../../sections/projects/projects.component';
import { TechStackComponent } from '../../sections/tech-stack/tech-stack.component';

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    TechStackComponent,
    ProjectsComponent,
    ContactComponent,
    LegalComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
