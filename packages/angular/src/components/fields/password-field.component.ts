import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NarrativeInlineInputComponent } from '../inline-input.component';

@Component({
  selector: 'ns-password-field',
  standalone: true,
  imports: [CommonModule, NarrativeInlineInputComponent],
  template: `
    <span class="ns-password-wrap">
      <ns-inline-input
        [fieldKey]="fieldKey"
        [type]="visible ? 'text' : 'password'"
        [placeholder]="placeholder"
        [defaultValue]="defaultValue"
        [suffix]="suffix"
        [inputClassName]="combinedClassName"
        [className]="className"
        (confirm)="onConfirm($event)"
        (change)="onChange($event)"
        (focus)="onFocus()"
        (blur)="onBlur($event)"
      ></ns-inline-input>
      <button
        *ngIf="showToggle"
        type="button"
        class="ns-password-toggle"
        (click)="toggleVisibility()"
        [attr.aria-label]="visible ? 'Hide password' : 'Show password'"
        tabindex="-1"
      >
        {{ visible ? 'Hide' : 'Show' }}
      </button>
    </span>
  `,
})
export class NarrativePasswordFieldComponent {
  @Input({ required: true }) fieldKey!: string;
  @Input() placeholder?: string;
  @Input() defaultValue = '';
  @Input() suffix?: string;
  @Input() showToggle = true;
  @Input() inputClassName?: string;
  @Input() className?: string;

  @Output() confirm = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<string>();

  visible = false;

  get combinedClassName(): string {
    return [this.inputClassName, 'ns-input--password'].filter(Boolean).join(' ');
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }

  onConfirm(val: string) { this.confirm.emit(val); }
  onChange(val: string) { this.change.emit(val); }
  onFocus() { this.focus.emit(); }
  onBlur(val: string) { this.blur.emit(val); }
}
