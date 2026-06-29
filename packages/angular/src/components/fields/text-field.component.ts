import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NarrativeInlineInputComponent } from '../inline-input.component';

@Component({
  selector: 'ns-text-field',
  standalone: true,
  imports: [CommonModule, NarrativeInlineInputComponent],
  template: `
    <ns-inline-input
      [fieldKey]="fieldKey"
      type="text"
      [placeholder]="placeholder"
      [defaultValue]="defaultValue"
      [suffix]="suffix"
      [inputClassName]="inputClassName"
      [className]="className"
      (confirm)="confirm.emit($event)"
      (change)="change.emit($event)"
      (focus)="focus.emit()"
      (blur)="blur.emit($event)"
    ></ns-inline-input>
  `,
})
export class NarrativeTextFieldComponent {
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
}
