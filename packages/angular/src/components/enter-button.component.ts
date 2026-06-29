import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-enter-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [ngClass]="['ns-enter-btn', className || '']"
      (click)="onClick()"
      aria-label="Confirm"
    >
      {{ label }}
    </button>
  `,
})
export class NarrativeEnterButtonComponent {
  @Input() label = '↵';
  @Input() className?: string;
  @Output() confirm = new EventEmitter<void>();

  onClick() {
    this.confirm.emit();
  }
}
