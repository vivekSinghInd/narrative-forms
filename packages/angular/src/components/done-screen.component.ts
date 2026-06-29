import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { NarrativeDone, NarrativeTypewriter } from '@viveksinghind/narrative-form-core';
import { NarrativeProseComponent } from './prose.component';

@Component({
  selector: 'ns-done-screen',
  standalone: true,
  imports: [CommonModule, NarrativeProseComponent],
  template: `
    <div class="ns-done">
      <h1 class="ns-done-heading">
        <ns-prose
          [text]="getMessage()"
          [animate]="typewriter?.enabled !== false"
          [speed]="typewriter?.speed || 38"
          [cursor]="typewriter?.cursor !== false"
          [cursorChar]="typewriter?.cursorChar || '|'"
          (complete)="onHeadingComplete()"
        ></ns-prose>
      </h1>

      <p *ngIf="false" class="ns-done-subtext">
        <ns-prose
          [text]="''"
          [animate]="typewriter?.enabled !== false"
          [speed]="typewriter?.speed || 38"
          [cursor]="false"
        ></ns-prose>
      </p>
    </div>
  `,
})
export class NarrativeDoneScreenComponent {
  @Input({ required: true }) done!: NarrativeDone;
  @Input() typewriter?: NarrativeTypewriter;

  showSubtext = false;

  ngOnInit() {
    if (this.typewriter?.enabled === false) {
      this.showSubtext = true;
    }
  }

  getMessage(): string {
    if (typeof this.done.message === 'function') {
      return this.done.message({});
    }
    return this.done.message || '';
  }

  onHeadingComplete() {
    this.showSubtext = true;
  }
}
