import { ref, onUnmounted, shallowRef, triggerRef } from "vue";
import type { NarrativeField, FormStateSnapshot, NarrativeFieldValues, NarrativeMeta } from "@viveksinghind/narrative-form-core";
import { FormStateEngine } from "@viveksinghind/narrative-form-core";

export function useFormState(fields: readonly NarrativeField[]) {
  const engine = new FormStateEngine(fields, () => {
    snapshot.value = engine.getSnapshot();
    triggerRef(snapshot);
  });

  const snapshot = shallowRef<FormStateSnapshot>(engine.getSnapshot());

  onUnmounted(() => {
    engine.reset();
  });

  return {
    snapshot,
    startTyping: (key: string) => engine.startTyping(key),
    activateField: (key: string) => engine.activateField(key),
    confirmField: (key: string, value: string | string[]) => engine.confirmField(key, value),
    editField: (key: string) => engine.editField(key),
    reconfirmField: (key: string, value: string | string[]) => engine.reconfirmField(key, value),
    next: () => engine.next(),
    focusField: (key: string) => engine.focusField(key),
    reset: () => {
      engine.reset();
      snapshot.value = engine.getSnapshot();
    },
    getValues: () => engine.getValues(),
    getMeta: (formId?: string, formVersion?: number) => engine.getMeta(formId, formVersion)
  };
}
