import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ns-prose',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ns-prose" [class.ns-prose--typing]="animate">
      <span class="ns-prose-text" [innerHTML]="displayText"></span>
      <span *ngIf="showCursor" class="ns-cursor" aria-hidden="true">{{ cursorChar }}</span>
    </span>
  `,
})
export class NarrativeProseComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) text!: string;
  @Input() animate = false;
  @Input() speed = 38;
  @Input() cursor = true;
  @Input() cursorChar = '|';
  @Input() pauseAfter = 100;

  @Output() complete = new EventEmitter<void>();

  displayText = '';
  showCursor = false;

  private typingInterval: any = null;
  private pauseTimeout: any = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initText();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['animate'] || changes['text']) {
      this.initText();
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.typingInterval) clearInterval(this.typingInterval);
    if (this.pauseTimeout) clearTimeout(this.pauseTimeout);
  }

  private initText() {
    this.cleanup();

    if (!this.animate) {
      this.displayText = this.text;
      this.showCursor = false;
      return;
    }

    this.displayText = '';
    this.showCursor = this.cursor;
    let index = 0;

    this.typingInterval = setInterval(() => {
      if (index < this.text.length) {
        this.displayText += this.text.charAt(index);
        index++;
        this.cdr.detectChanges();
      } else {
        clearInterval(this.typingInterval);
        this.pauseTimeout = setTimeout(() => {
          this.showCursor = false;
          this.cdr.detectChanges();
          this.complete.emit();
        }, this.pauseAfter);
      }
    }, this.speed);
  }
}
