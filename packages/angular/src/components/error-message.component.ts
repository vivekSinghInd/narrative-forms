import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" [ngClass]="['ns-error-wrap', 'ns-error--' + mode, 'ns-error--' + position]">
      <span class="ns-error-text">
        <span *ngIf="icon" class="ns-error-icon" aria-hidden="true">{{ iconChar }}</span>
        {{ message }}
      </span>
    </div>
  `,
})
export class NarrativeErrorMessageComponent {
  @Input({ required: true }) message!: string;
  // Fallback default values simulating the display object
  @Input() mode = 'inline';
  @Input() position = 'below';
  @Input() icon = true;
  @Input() iconChar = '⚠';
}
