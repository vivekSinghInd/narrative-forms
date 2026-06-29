import { Injectable, signal, computed, WritableSignal } from '@angular/core';
import { FormStateEngine, NarrativeField, NarrativeFieldValues, NarrativeMeta, FormStateSnapshot, FieldStatus } from '@viveksinghind/narrative-form-core';

@Injectable({
  providedIn: 'root'
})
export class NarrativeFormStateService {
  private engine: FormStateEngine | null = null;
  private readonly _snapshot = signal<FormStateSnapshot | null>(null);

  // Expose snapshot as a read-only signal
  readonly snapshot = computed(() => this._snapshot()!);

  initialize(fields: readonly NarrativeField[]): void {
    if (this.engine) {
      return;
    }
    this.engine = new FormStateEngine(fields, () => {
      this._snapshot.set(this.engine!.getSnapshot());
    });
    this._snapshot.set(this.engine.getSnapshot());
  }

  startTyping(key: string): void {
    this.engine?.startTyping(key);
  }

  activateField(key: string): void {
    this.engine?.activateField(key);
  }

  confirmField(key: string, value: string | string[]): void {
    this.engine?.confirmField(key, value);
  }

  editField(key: string): void {
    this.engine?.editField(key);
  }

  reconfirmField(key: string, value: string | string[]): void {
    this.engine?.reconfirmField(key, value);
  }

  next(): void {
    this.engine?.next();
  }

  focusField(key: string): void {
    this.engine?.focusField(key);
  }

  reset(): void {
    this.engine?.reset();
  }

  getValues(): NarrativeFieldValues {
    return this.engine?.getValues() || {};
  }

  getMeta(formId?: string, formVersion?: number): NarrativeMeta {
    return this.engine?.getMeta(formId, formVersion) || {
      formId,
      formVersion,
      totalTimeMs: 0,
      fieldTimings: {}
    };
  }
}
