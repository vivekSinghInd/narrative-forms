import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NarrativeToastService } from '../services/toast.service';

@Component({
  selector: 'ns-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ns-toast-container" aria-live="polite" *ngIf="toasts().length > 0">
      <div *ngFor="let toast of toasts()" class="ns-toast ns-animate-fade-up">
        <span *ngIf="toast.icon" class="ns-toast-icon">{{ toast.iconChar }} </span>
        <span class="ns-toast-message">{{ toast.message }}</span>
        <button 
          type="button" 
          class="ns-toast-close" 
          (click)="toastService.hideToast(toast.id)"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  `
})
export class NarrativeToastContainerComponent {
  toastService = inject(NarrativeToastService);
  toasts = this.toastService.toasts;
}
