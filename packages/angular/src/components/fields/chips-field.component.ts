import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-chips-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="['ns-chips-wrap', className || '']" role="listbox" [attr.aria-label]="fieldKey">
      <button
        *ngFor="let option of options; let i = index"
        #chipButton
        type="button"
        [ngClass]="[
          'ns-chip',
          selected === option ? 'ns-chip--active' : ''
        ]"
        (click)="handleSelect(option)"
        (keydown)="handleKeyDown($event, i)"
        [attr.aria-selected]="selected === option"
        role="option"
        [tabindex]="i === focusedIndex ? 0 : -1"
      >
        {{ option }}
      </button>

      <button
        *ngIf="!autoAdvance && selected !== null"
        type="button"
        class="ns-enter-btn"
        (click)="handleConfirm()"
        aria-label="Confirm"
        style="opacity: 1; transform: none;"
      >
        ↵
      </button>
    </span>
  `,
})
export class NarrativeChipsFieldComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) fieldKey!: string;
  @Input({ required: true }) options: string[] = [];
  @Input() defaultValue?: string;
  @Input() autoAdvance = false;
  @Input() className?: string;

  @Output() confirm = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();

  @ViewChildren('chipButton') chipButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  selected: string | null = null;
  focusedIndex = 0;

  ngOnInit() {
    this.selected = this.defaultValue ?? null;
  }

  ngAfterViewInit() {
    // Optionally focus the selected or first chip if we want,
    // but the React version doesn't auto-focus chips on mount.
  }

  handleSelect(option: string) {
    this.selected = option;
    this.change.emit(option);

    if (this.autoAdvance) {
      this.confirm.emit(option);
    }
  }

  handleConfirm() {
    if (this.selected !== null) {
      this.confirm.emit(this.selected);
    }
  }

  handleKeyDown(event: KeyboardEvent, index: number) {
    switch (event.key) {
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const option = this.options[index];
        if (option) {
          this.handleSelect(option);
        }
        break;
      }
      case 'ArrowRight':
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = (index + 1) % this.options.length;
        this.focusedIndex = nextIndex;
        this.chipButtons.toArray()[nextIndex]?.nativeElement.focus();
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = (index - 1 + this.options.length) % this.options.length;
        this.focusedIndex = prevIndex;
        this.chipButtons.toArray()[prevIndex]?.nativeElement.focus();
        break;
      }
    }
  }
}
