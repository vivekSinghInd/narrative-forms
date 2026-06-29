import { Directive, Input, Output, EventEmitter, ElementRef, OnChanges, SimpleChanges, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[nsTypewriter]',
  standalone: true
})
export class NarrativeTypewriterDirective implements OnChanges, OnDestroy {
  @Input('nsTypewriter') text = '';
  @Input() speed = 38;
  @Input() enabled = true;
  @Input() pauseAfter = 100;
  
  @Output() typingComplete = new EventEmitter<void>();

  private isBrowser: boolean;
  private interval: any = null;
  private pauseTimeout: any = null;

  constructor(private el: ElementRef, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private prefersReducedMotion(): boolean {
    if (!this.isBrowser || typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.startTyping();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.interval !== null) clearInterval(this.interval);
    if (this.pauseTimeout !== null) clearTimeout(this.pauseTimeout);
    this.interval = null;
    this.pauseTimeout = null;
  }

  private startTyping() {
    this.cleanup();

    if (!this.enabled || this.prefersReducedMotion() || this.text.length === 0) {
      this.el.nativeElement.textContent = this.text;
      this.typingComplete.emit();
      return;
    }

    let charIndex = 0;
    this.el.nativeElement.textContent = '';

    this.interval = setInterval(() => {
      charIndex++;
      this.el.nativeElement.textContent = this.text.slice(0, charIndex);
      
      if (charIndex >= this.text.length) {
        clearInterval(this.interval);
        this.interval = null;
        
        this.pauseTimeout = setTimeout(() => {
          this.typingComplete.emit();
        }, this.pauseAfter);
      }
    }, this.speed);
  }
}
