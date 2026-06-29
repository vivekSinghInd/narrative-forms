import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="['ns-cursor', className || '']" aria-hidden="true">{{ cursorChar }}</span>
  `,
})
export class NarrativeCursorComponent {
  @Input() cursorChar = '|';
  @Input() className?: string;
}
