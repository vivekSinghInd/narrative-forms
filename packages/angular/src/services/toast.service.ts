import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  message: string;
  icon?: boolean;
  iconChar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NarrativeToastService {
  private toastsSignal = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  showToast(message: string, icon = false, iconChar = '⚠') {
    const id = Math.random().toString(36).substring(2, 9);
    
    this.toastsSignal.update(toasts => [...toasts, { id, message, icon, iconChar }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      this.hideToast(id);
    }, 3000);
  }

  hideToast(id: string) {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }
}
