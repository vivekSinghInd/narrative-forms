import { Injectable } from '@angular/core';
import { NarrativeFormConfig, fetchFormConfig } from '@viveksinghind/narrative-form-core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NarrativeDynamicFormService {
  private configSubject = new BehaviorSubject<NarrativeFormConfig | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<Error | null>(null);

  config$ = this.configSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  async loadConfig(url: string, headers?: Record<string, string>): Promise<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    try {
      const config = await fetchFormConfig(url, { headers });
      this.configSubject.next(config);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      this.errorSubject.next(e);
      throw e;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  setConfig(config: NarrativeFormConfig) {
    this.configSubject.next(config);
  }
}
