/**
 * Framework-agnostic form state manager for narrative-form.
 * Manages field lifecycle, values, and timing metadata.
 *
 * @remarks
 * This module has zero framework dependencies — it is pure TypeScript logic
 * consumed by React/Vue/Angular wrappers.
 */

import type { NarrativeField, NarrativeFieldValues, NarrativeMeta } from "../types";

/** Possible statuses for a single field in the form flow. */
export type FieldStatus = "idle" | "typing" | "active" | "confirmed" | "editing";

/** Snapshot of the entire form's state at a point in time. */
export interface FormStateSnapshot {
  /** Ordered list of field configurations. */
  readonly fields: readonly NarrativeField[];
  /** Index of the currently active field (-1 if none are active yet). */
  readonly activeIndex: number;
  /** Map of field key → current value. */
  readonly values: Readonly<NarrativeFieldValues>;
  /** Map of field key → current lifecycle status. */
  readonly statuses: Readonly<Record<string, FieldStatus>>;
  /** Whether every field has been confirmed. */
  readonly isComplete: boolean;
}

/**
 * Pure form state engine for narrative-form.
 *
 * Tracks which field is active, all confirmed values, per-field statuses,
 * and timing metadata for analytics. Framework wrappers subscribe to
 * state changes via the `onChange` callback.
 */
export class FormStateEngine {
  private fields: readonly NarrativeField[];
  private activeIndex: number;
  private values: NarrativeFieldValues;
  private statuses: Record<string, FieldStatus>;
  private fieldTimings: Record<string, number>;
  private fieldStartTimes: Record<string, number>;
  private formStartTime: number;
  private onChange: (() => void) | undefined;

  /**
   * Create a new FormStateEngine.
   *
   * @param fields - Ordered array of field configurations
   * @param onChange - Optional callback invoked on every state mutation
   */
  constructor(fields: readonly NarrativeField[], onChange?: () => void) {
    this.fields = fields;
    this.activeIndex = -1;
    this.values = {};
    this.statuses = {};
    this.fieldTimings = {};
    this.fieldStartTimes = {};
    this.formStartTime = Date.now();
    this.onChange = onChange;

    // Initialise all field statuses to idle
    for (const field of fields) {
      this.statuses[field.key] = "idle";
      this.fieldTimings[field.key] = 0;
    }
  }

  /** Returns a readonly snapshot of the current form state. */
  getSnapshot(): FormStateSnapshot {
    return {
      fields: this.fields,
      activeIndex: this.activeIndex,
      values: { ...this.values },
      statuses: { ...this.statuses },
      isComplete: this.fields.every((f) => this.statuses[f.key] === "confirmed"),
    };
  }

  /** Returns a copy of all confirmed field values. */
  getValues(): NarrativeFieldValues {
    return { ...this.values };
  }

  /**
   * Returns analytics metadata about the form session.
   *
   * @param formId - Optional form identifier
   * @param formVersion - Optional form version number
   */
  getMeta(formId?: string, formVersion?: number): NarrativeMeta {
    return {
      formId,
      formVersion,
      totalTimeMs: Date.now() - this.formStartTime,
      fieldTimings: { ...this.fieldTimings },
    };
  }

  /**
   * Start typing animation for a specific field.
   * Transitions the field from `idle` to `typing`.
   *
   * @param key - The field key to begin typing
   */
  startTyping(key: string): void {
    const index = this.findFieldIndex(key);
    if (index === -1) return;

    this.statuses[key] = "typing";
    this.notify();
  }

  /**
   * Mark a field as active (typewriter finished, input is now visible).
   * Starts the timing clock for this field.
   *
   * @param key - The field key to activate
   */
  activateField(key: string): void {
    const index = this.findFieldIndex(key);
    if (index === -1) return;

    this.activeIndex = index;
    this.statuses[key] = "active";
    this.fieldStartTimes[key] = Date.now();
    this.notify();
  }

  /**
   * Confirm a field with a value.
   * Records the time spent on the field and advances to the next one.
   *
   * @param key - The field key to confirm
   * @param value - The confirmed value
   */
  confirmField(key: string, value: string | string[]): void {
    const index = this.findFieldIndex(key);
    if (index === -1) return;

    this.values[key] = value;
    this.statuses[key] = "confirmed";

    // Record timing
    const startTime = this.fieldStartTimes[key];
    if (startTime !== undefined) {
      this.fieldTimings[key] = Date.now() - startTime;
    }

    // Advance to next unconfirmed field
    const nextIndex = this.findNextUnconfirmedIndex(index);
    if (nextIndex !== -1) {
      this.activeIndex = nextIndex;
    }

    this.notify();
  }

  /**
   * Reopen a confirmed field for editing.
   * The field transitions to `editing` status with its current value preserved.
   *
   * @param key - The field key to edit
   */
  editField(key: string): void {
    const index = this.findFieldIndex(key);
    if (index === -1) return;
    if (this.statuses[key] !== "confirmed") return;

    this.statuses[key] = "editing";
    this.activeIndex = index;
    this.fieldStartTimes[key] = Date.now();
    this.notify();
  }

  /**
   * Re-confirm a field after editing.
   *
   * @param key - The field key to re-confirm
   * @param value - The new confirmed value
   */
  reconfirmField(key: string, value: string | string[]): void {
    const index = this.findFieldIndex(key);
    if (index === -1) return;

    this.values[key] = value;
    this.statuses[key] = "confirmed";

    // Record updated timing
    const startTime = this.fieldStartTimes[key];
    if (startTime !== undefined) {
      this.fieldTimings[key] = (this.fieldTimings[key] ?? 0) + (Date.now() - startTime);
    }

    // Return active index to the furthest unconfirmed field
    const nextIndex = this.findNextUnconfirmedIndex(-1);
    if (nextIndex !== -1) {
      this.activeIndex = nextIndex;
    }

    this.notify();
  }

  /**
   * Move to the next field without confirming the current one.
   * Useful for programmatic navigation via ref API.
   */
  next(): void {
    const nextIndex = this.findNextUnconfirmedIndex(this.activeIndex);
    if (nextIndex !== -1) {
      this.activeIndex = nextIndex;
      this.notify();
    }
  }

  /**
   * Focus a specific field by key.
   * Only works for confirmed fields (triggers edit) or the current active field.
   *
   * @param key - The field key to focus
   */
  focusField(key: string): void {
    const index = this.findFieldIndex(key);
    if (index === -1) return;

    const status = this.statuses[key];
    if (status === "confirmed") {
      this.editField(key);
    } else if (status === "active" || status === "editing") {
      // Already focusable — just ensure activeIndex is correct
      this.activeIndex = index;
      this.notify();
    }
  }

  /**
   * Reset all form state to initial values.
   * Clears all values, statuses, and timings.
   */
  reset(): void {
    this.activeIndex = -1;
    this.values = {};
    this.fieldTimings = {};
    this.fieldStartTimes = {};
    this.formStartTime = Date.now();

    for (const field of this.fields) {
      this.statuses[field.key] = "idle";
      this.fieldTimings[field.key] = 0;
    }

    this.notify();
  }

  /**
   * Update the onChange listener.
   * Used by framework wrappers to trigger re-renders.
   *
   * @param fn - Callback to invoke on state changes
   */
  setOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  // ── Private helpers ──────────────────────────────────────────────

  private findFieldIndex(key: string): number {
    return this.fields.findIndex((f) => f.key === key);
  }

  private findNextUnconfirmedIndex(afterIndex: number): number {
    for (let i = afterIndex + 1; i < this.fields.length; i++) {
      const field = this.fields[i];
      if (field && this.statuses[field.key] !== "confirmed") {
        return i;
      }
    }
    return -1;
  }

  private notify(): void {
    this.onChange?.();
  }
}
