<script setup lang="ts">
import { computed, watch, ref, onMounted, nextTick } from "vue";
import type {
  NarrativeField,
  NarrativeTypewriter,
  NarrativeWelcome,
  NarrativeDone,
  NarrativeCallbacks,
  NarrativeFieldValues,
  NarrativeI18n,
  NarrativeFormConfig,
} from "@viveksinghind/narrative-form-core";
import { mergeStrings } from "@viveksinghind/narrative-form-core";
import { useFormState } from "../composables/useFormState";
import WelcomeScreen from "./WelcomeScreen.vue";
import DoneScreen from "./DoneScreen.vue";
import Line from "./Line.vue";

const props = withDefaults(defineProps<{
  fields?: NarrativeField[];
  formConfig?: NarrativeFormConfig;
  typewriter?: NarrativeTypewriter;
  welcome?: NarrativeWelcome;
  done?: NarrativeDone;
  editable?: boolean;
  editLabel?: string;
  callbacks?: NarrativeCallbacks;
  defaultValues?: NarrativeFieldValues;
  values?: NarrativeFieldValues;
  strings?: Partial<NarrativeI18n>;
  reducedMotion?: boolean;
  layout?: "lines" | "paragraph";
}>(), {
  editable: true,
  layout: "lines"
});

const resolvedFields = computed(() => {
  if (props.fields) return props.fields;
  if (props.formConfig) return props.formConfig.fields;
  return [];
});

const resolvedWelcome = computed(() => {
  if (props.welcome) return props.welcome;
  if (props.formConfig && "welcome" in props.formConfig) return (props.formConfig as any).welcome;
  return undefined;
});

const resolvedDone = computed(() => {
  if (props.done) return props.done;
  if (props.formConfig && "done" in props.formConfig) return (props.formConfig as any).done;
  return undefined;
});

const effectiveTypewriter = computed<NarrativeTypewriter>(() => ({
  ...props.typewriter,
  enabled: props.reducedMotion ? false : (props.typewriter?.enabled ?? true),
}));

const i18n = computed(() => mergeStrings(props.strings));

const {
  snapshot,
  startTyping,
  activateField,
  confirmField,
  editField,
  reconfirmField,
  getMeta,
} = useFormState(resolvedFields.value);

const showWelcome = computed(() => resolvedWelcome.value?.show !== false && resolvedWelcome.value !== undefined);
const welcomeDismissed = ref(!showWelcome.value);
const hasStarted = ref(false);

const startFirstField = () => {
  if (!welcomeDismissed.value || hasStarted.value || resolvedFields.value.length === 0) return;
  hasStarted.value = true;
  const firstField = resolvedFields.value.find((f) => snapshot.value.statuses[f.key] !== "confirmed");
  if (firstField) {
    startTyping(firstField.key);
  }
};

watch(welcomeDismissed, startFirstField);
onMounted(startFirstField);

const handleConfirm = (key: string, value: string) => {
  const status = snapshot.value.statuses[key];
  if (status === "editing") {
    reconfirmField(key, value);
  } else {
    confirmField(key, value);
  }
  
  if (props.callbacks?.onFieldComplete) {
    props.callbacks.onFieldComplete(key, value, 0);
  }

  const currentIndex = resolvedFields.value.findIndex((f) => f.key === key);
  for (let i = currentIndex + 1; i < resolvedFields.value.length; i++) {
    const nextField = resolvedFields.value[i];
    if (!nextField || snapshot.value.statuses[nextField.key] === "confirmed") continue;
    startTyping(nextField.key);
    break;
  }
};

const visibleFields = computed(() => {
  return resolvedFields.value.filter((field) => {
    const status = snapshot.value.statuses[field.key];
    return status === "typing" || status === "active" || status === "confirmed" || status === "editing";
  });
});

const scrollContainerRef = ref<HTMLElement | null>(null);

watch(() => visibleFields.value.length, () => {
  nextTick(() => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.scrollTop = scrollContainerRef.value.scrollHeight;
    }
  });
});

</script>

<template>
    <div :class="['ns-root', layout === 'paragraph' ? 'ns-layout-paragraph' : 'ns-layout-lines']" ref="scrollContainerRef">
      <WelcomeScreen
        v-if="!welcomeDismissed && resolvedWelcome"
        :welcome="resolvedWelcome"
        :typewriter="effectiveTypewriter"
        @start="welcomeDismissed = true"
      />

    <div v-if="welcomeDismissed" class="ns-form-body">
      <Line
        v-for="field in visibleFields"
        :key="field.key"
        :field="field"
        :status="snapshot.statuses[field.key] ?? 'idle'"
        :value="props.values?.[field.key] ?? snapshot.values[field.key]"
        :allValues="snapshot.values"
        :typewriter="effectiveTypewriter"
        :editable="props.editable"
        :locked="false"
        :editLabel="props.editLabel ?? i18n.editLabel"
        @typingComplete="activateField"
        @confirm="handleConfirm"
        @edit="k => { editField(k); props.callbacks?.onEdit?.(k); }"
        @error="(k, err) => props.callbacks?.onError?.(k, err)"
        @change="(k, v) => props.callbacks?.onChange?.(k, v)"
        @focus="k => props.callbacks?.onFieldFocus?.(k)"
        @blur="(k, v) => props.callbacks?.onFieldBlur?.(k, v)"
      />
    </div>

    <DoneScreen
      v-if="snapshot.isComplete && resolvedDone"
      :done="resolvedDone"
      :values="snapshot.values"
      :meta="getMeta()"
      :typewriter="effectiveTypewriter"
    />
  </div>
</template>

<style scoped>
.ns-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1.25rem;
}
.ns-layout-lines .ns-form-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.ns-layout-paragraph .ns-form-body {
  display: block;
  flex-grow: 1;
}
</style>
