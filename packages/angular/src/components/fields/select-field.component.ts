import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-select-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="['ns-select-wrap', className || '']">
      <select
        #selectElement
        [id]="'ns-field-' + fieldKey"
        [ngClass]="['ns-select', inputClassName || '']"
        [value]="value"
        (change)="onChangeEvent($event)"
        (keydown)="onKeyDown($event)"
        (focus)="onFocusEvent()"
        (blur)="onBlurEvent()"
        [attr.aria-label]="fieldKey"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option *ngFor="let option of options" [value]="option">{{ option }}</option>
      </select>
      <button
        *ngIf="!autoAdvance && value !== ''"
        type="button"
        class="ns-enter-btn"
        (click)="onConfirmClick()"
        aria-label="Confirm"
      >
        ↵
      </button>
    </span>
  `,
})
export class NarrativeSelectFieldComponent implements AfterViewInit {
  @Input({ required: true }) fieldKey!: string;
  @Input({ required: true }) options: string[] = [];
  @Input() placeholder = 'Select…';
  @Input() defaultValue = '';
  @Input() autoAdvance = false;
  @Input() inputClassName?: string;
  @Input() className?: string;

  @Output() confirm = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<string>();

  @ViewChild('selectElement') selectElementRef!: ElementRef<HTMLSelectElement>;

  value = '';

  ngOnInit() {
    this.value = this.defaultValue;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.selectElementRef.nativeElement.focus();
    }, 0);
  }

  onChangeEvent(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.change.emit(this.value);

    if (this.autoAdvance && this.value !== '') {
      this.confirm.emit(this.value);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.value !== '') {
      event.preventDefault();
      this.confirm.emit(this.value);
    }
  }

  onFocusEvent() {
    this.focus.emit();
  }

  onBlurEvent() {
    this.blur.emit(this.value);
  }

  onConfirmClick() {
    if (this.value !== '') {
      this.confirm.emit(this.value);
    }
  }
}
