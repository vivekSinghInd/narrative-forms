import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-inline-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="['ns-input-wrap', className || '']">
      <input
        #inputElement
        [id]="'ns-field-' + fieldKey"
        [ngClass]="[
          'ns-input',
          'ns-input--' + type,
          isFocused ? 'ns-input--focused' : '',
          inputClassName || ''
        ]"
        [type]="type === 'number' ? 'text' : type"
        [attr.inputmode]="inputMode"
        [value]="value"
        [placeholder]="placeholder || ''"
        (input)="onInputChange($event)"
        (keydown)="onKeyDown($event)"
        (focus)="onInputFocus()"
        (blur)="onInputBlur()"
        (paste)="onInputPaste($event)"
        autocomplete="off"
        [attr.aria-label]="fieldKey"
      />
      <button class="ns-enter-btn" type="button" (click)="onConfirmClick()" aria-label="Confirm">↵</button>
      <span *ngIf="suffix" class="ns-suffix">{{ suffix }}</span>
    </span>
  `,
})
export class NarrativeInlineInputComponent implements AfterViewInit {
  @Input({ required: true }) fieldKey!: string;
  @Input() type = 'text';
  @Input() placeholder?: string;
  @Input() defaultValue = '';
  @Input() suffix?: string;
  @Input() sanitise?: (value: string) => string;
  @Input() inputClassName?: string;
  @Input() className?: string;

  @Output() confirm = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<string>();
  @Output() escape = new EventEmitter<void>();

  @ViewChild('inputElement') inputElementRef!: ElementRef<HTMLInputElement>;

  value = '';
  isFocused = false;

  get inputMode(): string | undefined {
    switch (this.type) {
      case 'tel': return 'tel';
      case 'email': return 'email';
      case 'number': return 'numeric';
      default: return undefined;
    }
  }

  ngOnInit() {
    this.value = this.defaultValue;
  }

  ngAfterViewInit() {
    // Auto-focus on mount
    setTimeout(() => {
      this.inputElementRef.nativeElement.focus();
    }, 0);
  }

  private applyValue(raw: string) {
    const cleaned = this.sanitise ? this.sanitise(raw) : raw;
    this.value = cleaned;
    this.inputElementRef.nativeElement.value = cleaned; // Sync native element just in case
    this.change.emit(cleaned);
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.applyValue(target.value);
  }

  onInputPaste(event: ClipboardEvent) {
    if (!this.sanitise) return;
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    this.applyValue(pasted);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.confirm.emit(this.value);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.escape.emit();
    }
  }

  onInputFocus() {
    this.isFocused = true;
    this.focus.emit();
  }

  onInputBlur() {
    this.isFocused = false;
    this.blur.emit(this.value);
  }

  onConfirmClick() {
    this.confirm.emit(this.value);
  }
}
