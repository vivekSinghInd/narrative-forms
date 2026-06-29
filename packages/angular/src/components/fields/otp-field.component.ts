import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-otp-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="['ns-otp-wrap', className || '']">
      <span class="ns-otp-boxes">
        <input
          *ngFor="let digit of digits; let i = index; trackBy: trackByIndex"
          #otpInput
          [ngClass]="[
            'ns-otp-box',
            digit !== '' ? 'ns-otp-box--filled' : '',
            activeIndex === i ? 'ns-otp-box--active' : ''
          ]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          [value]="digit"
          (input)="handleDigitChange(i, $event)"
          (keydown)="handleKeyDown(i, $event)"
          (paste)="handlePaste($event)"
          (focus)="handleFocus(i)"
          autocomplete="one-time-code"
          [attr.aria-label]="'Digit ' + (i + 1)"
        />
      </span>

      <button
        *ngIf="!autoAdvance && isComplete()"
        type="button"
        class="ns-enter-btn"
        (click)="onConfirmClick()"
        aria-label="Confirm"
      >
        ↵
      </button>

      <span class="ns-otp-resend-wrap">
        <button
          *ngIf="canResend"
          type="button"
          class="ns-otp-resend"
          (click)="handleResend()"
        >
          {{ resendLabel }}
        </button>
        <span *ngIf="!canResend" class="ns-otp-resend ns-otp-resend--disabled">
          <span class="ns-otp-timer">Resend in {{ timer }}s</span>
        </span>
      </span>
    </span>
  `,
})
export class NarrativeOtpFieldComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input({ required: true }) fieldKey!: string;
  @Input() otpLength = 6;
  @Input() autoAdvance = true;
  @Input() resendLabel = 'Resend code';
  @Input() resendDelay = 30;
  @Input() className?: string;

  @Output() request = new EventEmitter<void>();
  @Output() verify = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();

  @ViewChildren('otpInput') inputElements!: QueryList<ElementRef<HTMLInputElement>>;

  digits: string[] = [];
  activeIndex = 0;
  timer = 30;
  canResend = false;

  private timerInterval: any = null;
  private hasRequested = false;

  ngOnInit() {
    this.digits = Array.from({ length: this.otpLength }, () => '');
    this.timer = this.resendDelay;

    if (!this.hasRequested) {
      this.hasRequested = true;
      this.request.emit();
    }

    this.startTimer();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.focusBox(0);
    }, 0);
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  trackByIndex(index: number): number {
    return index;
  }

  isComplete(): boolean {
    return this.digits.every(d => d !== '');
  }

  private startTimer() {
    if (this.resendDelay <= 0) {
      this.canResend = true;
      return;
    }

    this.timer = this.resendDelay;
    this.canResend = false;

    this.clearTimer();
    this.timerInterval = setInterval(() => {
      if (this.timer <= 1) {
        this.clearTimer();
        this.canResend = true;
        this.timer = 0;
      } else {
        this.timer--;
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private getOtpString(d: string[]): string {
    return d.join('');
  }

  private focusBox(index: number) {
    if (index >= 0 && index < this.otpLength) {
      const inputs = this.inputElements.toArray();
      inputs[index]?.nativeElement.focus();
      this.activeIndex = index;
    }
  }

  private emitChangeAndCheck(newDigits: string[]) {
    const otpString = this.getOtpString(newDigits);
    this.change.emit(otpString);

    if (newDigits.every(d => d !== '')) {
      this.verify.emit(otpString);
      if (this.autoAdvance) {
        setTimeout(() => this.confirm.emit(otpString), 0);
      }
    }
  }

  handleDigitChange(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const digit = value.replace(/\D/g, '').slice(-1);

    this.digits[index] = digit;
    
    // Update native element in case we stripped something
    target.value = digit;

    this.emitChangeAndCheck(this.digits);

    if (digit !== '' && index < this.otpLength - 1) {
      this.focusBox(index + 1);
    }
  }

  handleKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.digits[index] !== '') {
        this.digits[index] = '';
        this.emitChangeAndCheck(this.digits);
      } else if (index > 0) {
        this.digits[index - 1] = '';
        this.focusBox(index - 1);
        this.emitChangeAndCheck(this.digits);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.isComplete()) {
        this.confirm.emit(this.getOtpString(this.digits));
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusBox(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.otpLength - 1) {
      event.preventDefault();
      this.focusBox(index + 1);
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, this.otpLength) || '';
    if (pastedData.length === 0) return;

    for (let i = 0; i < pastedData.length; i++) {
      this.digits[i] = pastedData[i];
    }

    this.emitChangeAndCheck(this.digits);

    const nextEmptyIndex = this.digits.findIndex(d => d === '');
    const focusIndex = nextEmptyIndex === -1 ? this.otpLength - 1 : nextEmptyIndex;
    this.focusBox(focusIndex);
  }

  handleResend() {
    if (!this.canResend) return;
    
    this.digits = Array.from({ length: this.otpLength }, () => '');
    this.focusBox(0);
    this.request.emit();
    this.startTimer();
  }

  handleFocus(index: number) {
    this.activeIndex = index;
  }

  onConfirmClick() {
    this.confirm.emit(this.getOtpString(this.digits));
  }
}
