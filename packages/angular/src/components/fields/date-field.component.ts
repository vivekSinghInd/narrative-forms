import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NarrativeInlineInputComponent } from '../inline-input.component';

@Component({
  selector: 'ns-date-field',
  standalone: true,
  imports: [CommonModule, NarrativeInlineInputComponent],
  template: `
    <ns-inline-input
      [fieldKey]="fieldKey"
      type="date"
      [placeholder]="placeholder"
      [defaultValue]="defaultValue"
      [suffix]="suffix"
      [inputClassName]="inputClassName"
      [className]="className"
      (confirm)="onConfirm($event)"
      (change)="onChange($event)"
      (focus)="onFocus()"
      (blur)="onBlur($event)"
    ></ns-inline-input>
  `,
})
export class NarrativeDateFieldComponent {
  @Input({ required: true }) fieldKey!: string;
  @Input() placeholder?: string;
  @Input() defaultValue = '';
  @Input() suffix?: string;
  @Input() inputClassName?: string;
  @Input() className?: string;

  @Output() confirm = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<string>();

  onConfirm(val: string) { this.confirm.emit(val); }
  onChange(val: string) { this.change.emit(val); }
  onFocus() { this.focus.emit(); }
  onBlur(val: string) { this.blur.emit(val); }
}
