import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { NarrativeFormConfig, NarrativeFieldValues } from '@viveksinghind/narrative-form-core';
import { NarrativeFormStateService } from '../services/form-state.service';
import { NarrativeWelcomeScreenComponent } from './welcome-screen.component';
import { NarrativeLineComponent } from './line.component';
import { NarrativeDoneScreenComponent } from './done-screen.component';
import { NarrativeToastContainerComponent } from './toast-container.component';

@Component({
  selector: 'ns-narrative-form',
  standalone: true,
  imports: [
    CommonModule,
    NarrativeWelcomeScreenComponent,
    NarrativeLineComponent,
    NarrativeDoneScreenComponent,
    NarrativeToastContainerComponent
  ],
  template: `
    <div [ngClass]="['ns-form', className, layout === 'paragraph' ? 'ns-layout-paragraph' : 'ns-layout-lines']">
      <!-- Welcome Screen -->
      <ns-welcome-screen
        *ngIf="showWelcome"
        [welcome]="config.welcome!"
        [typewriter]="$any(config).typewriter"
        (start)="handleStart()"
      ></ns-welcome-screen>

      <!-- Form Fields -->
      <div *ngIf="showFields" class="ns-fields" role="form" aria-live="polite">
        <ng-container *ngFor="let field of config.fields">
          <ns-line
            *ngIf="snapshot.statuses[field.key] && snapshot.statuses[field.key] !== 'idle'"
            [field]="field"
            [status]="snapshot.statuses[field.key]"
            [value]="snapshot.values[field.key]"
            [allValues]="snapshot.values"
            [typewriter]="$any(config).typewriter"
            [editable]="editable !== false"
            [locked]="field.lockPrevious && snapshot.statuses[field.key] === 'active'"
            [editLabel]="editLabel"
            (typingComplete)="formState.activateField($event)"
            (confirm)="onConfirm($event)"
            (edit)="formState.editField($event)"
            (changeEvent)="onChange($event)"
            (focusEvent)="formState.focusField($event)"
          ></ns-line>
        </ng-container>
      </div>

      <!-- Done Screen -->
      <ns-done-screen
        *ngIf="showDone"
        [done]="config.done!"
        [typewriter]="$any(config).typewriter"
      ></ns-done-screen>

      <!-- Toast Container -->
      <ns-toast-container></ns-toast-container>
    </div>
  `,
  providers: [NarrativeFormStateService] // Local to this component instance
})
export class NarrativeFormComponent implements OnInit {
  @Input({ required: true }) config!: NarrativeFormConfig;
  @Input() editable = true;
  @Input() editLabel = 'Edit';
  @Input() className = '';
  @Input() layout: 'lines' | 'paragraph' = 'lines';

  @Output() completed = new EventEmitter<NarrativeFieldValues>();
  @Output() valuesChange = new EventEmitter<NarrativeFieldValues>();
  @Output() event = new EventEmitter<{ type: string; payload?: any }>();

  hasStarted = false;

  constructor(public formState: NarrativeFormStateService) {}

  get snapshot() {
    return this.formState.snapshot();
  }

  get showWelcome(): boolean {
    return !!this.config.welcome && !this.hasStarted;
  }

  get showDone(): boolean {
    return !!this.config.done && this.snapshot.isComplete;
  }

  get showFields(): boolean {
    if (this.showWelcome) return false;
    if (this.showDone) return false;
    return true;
  }

  ngOnInit() {
    if (!this.config || !this.config.fields) {
      throw new Error('NarrativeForm requires a valid config with fields.');
    }
    this.formState.initialize(this.config.fields);

    // If no welcome screen, start typing the first field immediately
    if (!this.config.welcome) {
      this.hasStarted = true;
      this.startFirstField();
    }
  }

  handleStart() {
    this.hasStarted = true;
    this.startFirstField();
  }

  private startFirstField() {
    const firstKey = this.config.fields[0]?.key;
    if (firstKey) {
      this.formState.startTyping(firstKey);
    }
  }

  onConfirm(event: { key: string; value: string }) {
    this.formState.confirmField(event.key, event.value);
    
    // Check if the current value update completes the form
    const currentValues = this.formState.getValues();
    this.valuesChange.emit(currentValues);
    this.event.emit({ type: 'field_confirmed', payload: { key: event.key, value: event.value } });

    if (this.formState.snapshot().isComplete) {
      this.completed.emit(currentValues);
      this.event.emit({ type: 'form_completed', payload: currentValues });
    } else {
      // Find the next unconfirmed field and start its typing animation
      const currentIndex = this.config.fields.findIndex(f => f.key === event.key);
      for (let i = currentIndex + 1; i < this.config.fields.length; i++) {
        const nextField = this.config.fields[i];
        if (!nextField || this.snapshot.statuses[nextField.key] === 'confirmed') continue;
        this.formState.startTyping(nextField.key);
        break;
      }
    }
  }

  onChange(event: { key: string; value: string }) {
    this.event.emit({ type: 'field_change', payload: { key: event.key, value: event.value } });
  }
}
