import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-filled-value',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ns-filled-wrap">
      <span class="ns-filled-value">{{ value }}</span>
      <span *ngIf="suffix" class="ns-suffix">{{ suffix }}</span>
      <button
        *ngIf="editable"
        type="button"
        class="ns-edit-btn"
        (click)="onEditClick()"
        [attr.aria-label]="editLabel"
      >
        ✎
      </button>
    </span>
  `,
})
export class NarrativeFilledValueComponent {
  @Input({ required: true }) value!: string;
  @Input() suffix?: string;
  @Input() editable = true;
  @Input() editLabel = 'Edit';

  @Output() edit = new EventEmitter<void>();

  onEditClick() {
    this.edit.emit();
  }
}
