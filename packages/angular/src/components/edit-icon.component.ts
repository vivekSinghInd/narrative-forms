import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-edit-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [ngClass]="['ns-edit-btn', className || '']"
      (click)="onClick()"
      [attr.aria-label]="label"
      [title]="label"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
    </button>
  `,
})
export class NarrativeEditIconComponent {
  @Input() label = 'Edit';
  @Input() className?: string;
  @Output() edit = new EventEmitter<void>();

  onClick() {
    this.edit.emit();
  }
}
