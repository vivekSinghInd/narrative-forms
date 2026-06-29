import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-multi-chips-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="['ns-chips-wrap', className || '']">
      <button
        *ngFor="let option of options; let i = index"
        #chipButton
        type="button"
        [ngClass]="[
          'ns-chip',
          selected.has(option) ? 'ns-chip--active' : '',
          hoveredIndex === i ? 'ns-chip--hover' : ''
        ]"
        (click)="handleToggle(option)"
        (keydown)="handleKeyDown($event, option)"
        (mouseenter)="hoveredIndex = i"
        (mouseleave)="hoveredIndex = null"
        [attr.aria-pressed]="selected.has(option)"
        role="option"
      >
        {{ option }}
      </button>

      <button
        *ngIf="selected.size > 0"
        type="button"
        class="ns-enter-btn"
        (click)="handleConfirm()"
        aria-label="Confirm"
      >
        ↵
      </button>
    </span>
  `,
})
export class NarrativeMultiChipsFieldComponent implements OnInit {
  @Input({ required: true }) fieldKey!: string;
  @Input({ required: true }) options: string[] = [];
  @Input() defaultValue?: string[];
  @Input() className?: string;

  @Output() confirm = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();

  @ViewChildren('chipButton') chipButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  selected = new Set<string>();
  hoveredIndex: number | null = null;

  ngOnInit() {
    this.selected = new Set(this.defaultValue || []);
  }

  handleToggle(option: string) {
    if (this.selected.has(option)) {
      this.selected.delete(option);
    } else {
      this.selected.add(option);
    }
    const value = Array.from(this.selected).join(', ');
    this.change.emit(value);
  }

  handleConfirm() {
    if (this.selected.size > 0) {
      this.confirm.emit(Array.from(this.selected).join(', '));
    }
  }

  handleKeyDown(event: KeyboardEvent, option: string) {
    if (event.key === 'Enter' && this.selected.size > 0) {
      event.preventDefault();
      this.handleConfirm();
    } else if (event.key === ' ') {
      event.preventDefault();
      this.handleToggle(option);
    }
  }
}
