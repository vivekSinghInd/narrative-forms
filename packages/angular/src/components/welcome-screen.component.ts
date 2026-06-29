import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { NarrativeWelcome, NarrativeTypewriter } from '@viveksinghind/narrative-form-core';
import { NarrativeProseComponent } from './prose.component';

@Component({
  selector: 'ns-welcome-screen',
  standalone: true,
  imports: [CommonModule, NarrativeProseComponent],
  template: `
    <div class="ns-welcome">
      <h1 class="ns-welcome-heading">
        <ns-prose
          [text]="welcome.heading || ''"
          [animate]="typewriter?.enabled !== false"
          [speed]="typewriter?.speed || 38"
          [cursor]="typewriter?.cursor !== false"
          [cursorChar]="typewriter?.cursorChar || '|'"
          (complete)="onHeadingComplete()"
        ></ns-prose>
      </h1>

      <p *ngIf="welcome.subtext && showSubtext" class="ns-welcome-subtext">
        <ns-prose
          [text]="welcome.subtext"
          [animate]="typewriter?.enabled !== false"
          [speed]="typewriter?.speed || 38"
          [cursor]="false"
          (complete)="onSubtextComplete()"
        ></ns-prose>
      </p>

      <button
        *ngIf="showButton"
        type="button"
        class="ns-welcome-cta"
        (click)="start.emit()"
      >
        {{ welcome.ctaLabel || "Let's go →" }}
      </button>
    </div>
  `,
})
export class NarrativeWelcomeScreenComponent {
  @Input({ required: true }) welcome!: NarrativeWelcome;
  @Input() typewriter?: NarrativeTypewriter;

  @Output() start = new EventEmitter<void>();

  showSubtext = false;
  showButton = false;

  ngOnInit() {
    if (this.typewriter?.enabled === false) {
      this.showSubtext = true;
      this.showButton = true;
    }
  }

  onHeadingComplete() {
    this.showSubtext = true;
    if (!this.welcome.subtext) {
      this.showButton = true;
    }
  }

  onSubtextComplete() {
    this.showButton = true;
  }
}
