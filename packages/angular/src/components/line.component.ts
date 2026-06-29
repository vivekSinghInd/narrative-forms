import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NarrativeField, NarrativeTypewriter, NarrativeFieldValues, FieldStatus, validateField, validateFieldAsync, hasAsyncValidation } from '@viveksinghind/narrative-form-core';
import { NarrativeToastService } from '../services/toast.service';

import { NarrativeProseComponent } from './prose.component';
import { NarrativeFilledValueComponent } from './filled-value.component';
import { NarrativeErrorMessageComponent } from './error-message.component';
import { NarrativeInlineInputComponent } from './inline-input.component';
import { NarrativePasswordFieldComponent } from './fields/password-field.component';
import { NarrativeDateFieldComponent } from './fields/date-field.component';
import { NarrativeSelectFieldComponent } from './fields/select-field.component';
import { NarrativeOtpFieldComponent } from './fields/otp-field.component';
import { NarrativeChipsFieldComponent } from './fields/chips-field.component';
import { NarrativeMultiChipsFieldComponent } from './fields/multi-chips-field.component';

@Component({
  selector: 'ns-line',
  standalone: true,
  imports: [
    CommonModule,
    NarrativeProseComponent,
    NarrativeFilledValueComponent,
    NarrativeErrorMessageComponent,
    NarrativeInlineInputComponent,
    NarrativePasswordFieldComponent,
    NarrativeDateFieldComponent,
    NarrativeSelectFieldComponent,
    NarrativeOtpFieldComponent,
    NarrativeChipsFieldComponent,
    NarrativeMultiChipsFieldComponent,
  ],
  template: `
    <div [ngClass]="lineClasses" role="group" [attr.aria-label]="field.prefix">
      <ns-prose
        [text]="field.prefix"
        [animate]="status === 'typing' && shouldAnimate"
        [speed]="typewriter?.speed || 38"
        [cursor]="typewriter?.cursor !== false"
        [cursorChar]="typewriter?.cursorChar || '|'"
        [pauseAfter]="typewriter?.pauseAfter || 100"
        (complete)="onTypingCompleteEvent()"
      ></ns-prose>

      <ng-container *ngIf="showInput">
        <ng-container [ngSwitch]="field.type">
          <ns-chips-field
            *ngSwitchCase="'chips'"
            [fieldKey]="field.key"
            [options]="field.options || []"
            [defaultValue]="editValue"
            [autoAdvance]="field.autoAdvance || false"
            [className]="field.inputClassName"
            (confirm)="handleConfirm($event)"
            (change)="handleChange($event)"
          ></ns-chips-field>

          <ns-multi-chips-field
            *ngSwitchCase="'multi-chips'"
            [fieldKey]="field.key"
            [options]="field.options || []"
            [defaultValue]="multiEditValue"
            [className]="field.inputClassName"
            (confirm)="handleConfirm($event)"
            (change)="handleChange($event)"
          ></ns-multi-chips-field>

          <ns-select-field
            *ngSwitchCase="'select'"
            [fieldKey]="field.key"
            [options]="field.options || []"
            [placeholder]="field.placeholder"
            [defaultValue]="editValue"
            [autoAdvance]="field.autoAdvance || false"
            [inputClassName]="field.inputClassName"
            (confirm)="handleConfirm($event)"
            (change)="handleChange($event)"
            (focus)="handleFocus()"
            (blur)="handleBlur($event)"
          ></ns-select-field>

          <ns-otp-field
            *ngSwitchCase="'otp'"
            [fieldKey]="field.key"
            [otpLength]="field.otpLength || 6"
            [autoAdvance]="field.autoAdvance !== false"
            [resendLabel]="field.resendLabel || 'Resend code'"
            [resendDelay]="field.resendDelay || 30"
            [className]="field.inputClassName"
            (request)="field.onRequest && field.onRequest()"
            (verify)="field.onVerify && field.onVerify($event)"
            (confirm)="handleConfirm($event)"
            (change)="handleChange($event)"
          ></ns-otp-field>

          <ns-password-field
            *ngSwitchCase="'password'"
            [fieldKey]="field.key"
            [placeholder]="field.placeholder"
            [defaultValue]="editValue"
            [suffix]="field.suffix"
            [inputClassName]="field.inputClassName"
            (confirm)="handleConfirm($event)"
            (change)="handleChange($event)"
            (focus)="handleFocus()"
            (blur)="handleBlur($event)"
          ></ns-password-field>

          <ns-date-field
            *ngSwitchCase="'date'"
            [fieldKey]="field.key"
            [placeholder]="field.placeholder"
            [defaultValue]="editValue"
            [suffix]="field.suffix"
            [inputClassName]="field.inputClassName"
            (confirm)="handleConfirm($event)"
            (change)="handleChange($event)"
            (focus)="handleFocus()"
            (blur)="handleBlur($event)"
          ></ns-date-field>

          <ns-inline-input
            *ngSwitchDefault
            [fieldKey]="field.key"
            [type]="field.type"
            [placeholder]="field.placeholder"
            [defaultValue]="editValue"
            [suffix]="field.suffix"
            [sanitise]="field.sanitise"
            [inputClassName]="field.inputClassName"
            (confirm)="handleConfirm($event)"
            (change)="handleChange($event)"
            (focus)="handleFocus()"
            (blur)="handleBlur($event)"
          ></ns-inline-input>
        </ng-container>
      </ng-container>

      <span *ngIf="showInput && asyncState === 'validating'" class="ns-loading-indicator" aria-label="Validating"></span>
      <span *ngIf="showInput && asyncState === 'valid'" class="ns-success-indicator" aria-label="Valid">✓</span>

      <ns-filled-value
        *ngIf="showFilled"
        [value]="displayValue"
        [suffix]="field.suffix"
        [editable]="isFieldEditable"
        [editLabel]="editLabel"
        (edit)="handleEdit()"
      ></ns-filled-value>

      <ns-error-message
        *ngIf="error !== null && showInput"
        [message]="error"
        [mode]="field.validation?.errorDisplay?.mode || 'inline'"
        [position]="field.validation?.errorDisplay?.position || 'below'"
        [icon]="field.validation?.errorDisplay?.icon !== false"
        [iconChar]="field.validation?.errorDisplay?.iconChar || '⚠'"
      ></ns-error-message>
    </div>
  `,
})
export class NarrativeLineComponent implements OnDestroy {
  @Input({ required: true }) field!: NarrativeField;
  @Input({ required: true }) status!: FieldStatus;
  @Input() value?: string | string[];
  @Input() allValues: NarrativeFieldValues = {};
  @Input() typewriter?: NarrativeTypewriter;
  @Input() editable = true;
  @Input() locked = false;
  @Input() editLabel = 'Edit';

  @Output() typingComplete = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<{ key: string; value: string }>();
  @Output() edit = new EventEmitter<string>();
  @Output() errorChange = new EventEmitter<{ key: string; message: string }>();
  @Output() changeEvent = new EventEmitter<{ key: string; value: string }>();
  @Output() focusEvent = new EventEmitter<string>();
  @Output() blurEvent = new EventEmitter<{ key: string; value: string }>();

  error: string | null = null;
  shake = false;
  asyncState: 'idle' | 'validating' | 'valid' | 'invalid' = 'idle';

  private abortRef: (() => void) | null = null;

  constructor(private toastService: NarrativeToastService) {}

  ngOnDestroy() {
    if (this.abortRef) {
      this.abortRef();
    }
  }

  get isFieldEditable(): boolean {
    return this.field.editable !== false && this.editable && !this.locked;
  }

  get shouldAnimate(): boolean {
    return this.field.animate !== false && this.typewriter?.enabled !== false;
  }

  get editValue(): string {
    return this.status === 'editing' && this.value !== undefined
      ? String(this.value)
      : (this.field.defaultValue || '');
  }

  get multiEditValue(): string[] {
    if (this.status === 'editing' && Array.isArray(this.value)) {
      return this.value;
    }
    return (this.field.defaultValue || '').split(', ').filter(Boolean);
  }

  get displayValue(): string {
    return String(this.value || '');
  }

  get showInput(): boolean {
    return this.status === 'active' || this.status === 'editing';
  }

  get showFilled(): boolean {
    return this.status === 'confirmed';
  }

  get lineClasses(): string {
    return [
      'ns-line',
      `ns-line-${this.field.key}`,
      this.status === 'active' || this.status === 'editing' ? 'ns-line--active' : '',
      this.status === 'confirmed' ? 'ns-line--confirmed' : '',
      this.status === 'editing' ? 'ns-line--editing' : '',
      this.error !== null ? 'ns-line--error' : '',
      this.shake ? 'ns-line--shake' : '',
      this.field.className || ''
    ].filter(Boolean).join(' ');
  }

  onTypingCompleteEvent() {
    if (this.status === 'typing') {
      this.typingComplete.emit(this.field.key);
    }
  }

  handleConfirm(val: string) {
    if (this.abortRef) {
      this.abortRef();
      this.abortRef = null;
    }

    const result = validateField(val, this.field.validation, this.allValues);

    if (!result.valid) {
      const firstError = result.errors[0] || 'Validation failed';
      this.error = firstError;
      this.asyncState = 'idle';
      this.errorChange.emit({ key: this.field.key, message: firstError });

      const display = this.field.validation?.errorDisplay;
      const mode = display?.mode || 'inline';

      if (mode === 'shake' || mode === 'inline+shake') {
        this.shake = false;
        setTimeout(() => (this.shake = true), 10);
      }

      if (mode === 'toast') {
        this.toastService.showToast(firstError, display?.icon !== false, display?.iconChar || '⚠');
      }

      return;
    }

    if (hasAsyncValidation(this.field.validation)) {
      this.asyncState = 'validating';
      this.error = null;

      const handle = validateFieldAsync(val, this.field.validation, this.allValues);
      this.abortRef = handle.abort;

      handle.promise
        .then((asyncResult) => {
          if (!asyncResult.valid) {
            const firstError = asyncResult.errors[0] || 'Validation failed';
            this.error = firstError;
            this.asyncState = 'invalid';
            this.errorChange.emit({ key: this.field.key, message: firstError });
          } else {
            this.asyncState = 'valid';
            this.error = null;
            setTimeout(() => {
              this.asyncState = 'idle';
              this.confirm.emit({ key: this.field.key, value: val });
            }, 300);
          }
        })
        .catch(() => {
          this.asyncState = 'idle';
        });

      return;
    }

    this.error = null;
    this.shake = false;
    this.asyncState = 'idle';
    this.confirm.emit({ key: this.field.key, value: val });
  }

  handleEdit() {
    this.error = null;
    this.shake = false;
    this.asyncState = 'idle';
    if (this.abortRef) {
      this.abortRef();
    }
    this.edit.emit(this.field.key);
  }

  handleChange(val: string) {
    const clearOn = this.field.validation?.errorDisplay?.clearOn || 'onChange';
    if (clearOn === 'onChange' && this.error !== null) {
      this.error = null;
      this.shake = false;
      this.asyncState = 'idle';
    }
    this.changeEvent.emit({ key: this.field.key, value: val });
  }

  handleFocus() {
    const clearOn = this.field.validation?.errorDisplay?.clearOn || 'onChange';
    if (clearOn === 'onFocus' && this.error !== null) {
      this.error = null;
      this.shake = false;
      this.asyncState = 'idle';
    }
    this.focusEvent.emit(this.field.key);
  }

  handleBlur(val: string) {
    this.blurEvent.emit({ key: this.field.key, value: val });
  }
}
