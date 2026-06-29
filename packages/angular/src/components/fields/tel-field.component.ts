import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NarrativeInlineInputComponent } from '../inline-input.component';

@Component({
  selector: 'ns-tel-field',
  standalone: true,
  imports: [CommonModule, NarrativeInlineInputComponent],
  template: `
    <ns-inline-input
      [fieldKey]="fieldKey"
      type="tel"
      [placeholder]="placeholder"
      [defaultValue]="defaultValue"
      [suffix]="suffix"
      [sanitise]="sanitise"
      [inputClassName]="inputClassName"
      [className]="className"
      (confirm)="confirm.emit($event)"
      (change)="change.emit($event)"
      (focus)="focus.emit()"
      (blur)="blur.emit($event)"
    ></ns-inline-input>
  `,
})
export class NarrativeTelFieldComponent {
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

  sanitise = (val: string) => val.replace(/[^\d+()\s-]/g, '');
}
