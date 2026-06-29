/**
 * React hook wrapping the core FormStateEngine.
 *
 * @remarks
 * Bridges the framework-agnostic FormStateEngine with React's
 * state management. Each state mutation in the engine triggers
 * a React re-render via `useSyncExternalStore`-like pattern.
 */

import { useState, useRef, useCallback, useMemo } from "react";
import type { NarrativeField, NarrativeFieldValues, NarrativeMeta } from "@viveksinghind/narrative-form-core";
import { FormStateEngine } from "@viveksinghind/narrative-form-core";
import type { FieldStatus, FormStateSnapshot } from "@viveksinghind/narrative-form-core";

/** Return value of the useFormState hook. */
export interface UseFormStateResult {
  /** Current snapshot of the form state. */
  snapshot: FormStateSnapshot;
  /** Start the typewriter animation for a field. */
  startTyping: (key: string) => void;
  /** Mark a field as active (typewriter done, input visible). */
  activateField: (key: string) => void;
  /** Confirm a field with a value. */
  confirmField: (key: string, value: string | string[]) => void;
  /** Reopen a confirmed field for editing. */
  editField: (key: string) => void;
  /** Re-confirm a field after editing. */
  reconfirmField: (key: string, value: string | string[]) => void;
  /** Move to the next field. */
  next: () => void;
  /** Focus a specific field by key. */
  focusField: (key: string) => void;
  /** Reset all form state. */
  reset: () => void;
  /** Get all confirmed values. */
  getValues: () => NarrativeFieldValues;
  /** Get analytics metadata. */
  getMeta: (formId?: string, formVersion?: number) => NarrativeMeta;
}

/**
 * React hook that manages the narrative form state.
 *
 * @param fields - Ordered array of field configurations
 * @returns Form state and mutation methods
 */
export function useFormState(fields: readonly NarrativeField[]): UseFormStateResult {
  // Use a counter to force re-renders when the engine mutates
  const [, setTick] = useState(0);

  const engineRef = useRef<FormStateEngine | null>(null);

  // Lazily initialise the engine
  if (engineRef.current === null) {
    engineRef.current = new FormStateEngine(fields, () => {
      setTick((t) => t + 1);
    });
  }

  const engine = engineRef.current;

  // Stable method references
  const startTyping = useCallback((key: string) => engine.startTyping(key), [engine]);
  const activateField = useCallback((key: string) => engine.activateField(key), [engine]);
  const confirmField = useCallback(
    (key: string, value: string | string[]) => engine.confirmField(key, value),
    [engine],
  );
  const editField = useCallback((key: string) => engine.editField(key), [engine]);
  const reconfirmField = useCallback(
    (key: string, value: string | string[]) => engine.reconfirmField(key, value),
    [engine],
  );
  const next = useCallback(() => engine.next(), [engine]);
  const focusField = useCallback((key: string) => engine.focusField(key), [engine]);
  const reset = useCallback(() => engine.reset(), [engine]);
  const getValues = useCallback(() => engine.getValues(), [engine]);
  const getMeta = useCallback(
    (formId?: string, formVersion?: number) => engine.getMeta(formId, formVersion),
    [engine],
  );

  const snapshot = engine.getSnapshot();

  return useMemo(
    () => ({
      snapshot,
      startTyping,
      activateField,
      confirmField,
      editField,
      reconfirmField,
      next,
      focusField,
      reset,
      getValues,
      getMeta,
    }),
    // snapshot changes every tick, which is what we want
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snapshot],
  );
}
