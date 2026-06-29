<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import EnterButton from "./EnterButton.vue";

const props = withDefaults(defineProps<{
  fieldKey: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  suffix?: string;
  sanitise?: (value: string) => string;
  inputClassName?: string;
  className?: string;
}>(), {
  type: "text",
  defaultValue: "",
});

const emit = defineEmits<{
  (e: "confirm", value: string): void;
  (e: "change", value: string): void;
  (e: "focus"): void;
  (e: "blur", value: string): void;
  (e: "escape"): void;
}>();

const value = ref(props.defaultValue);
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputRef.value?.focus();
});

const applyValue = (raw: string) => {
  const cleaned = props.sanitise ? props.sanitise(raw) : raw;
  value.value = cleaned;
  emit("change", cleaned);
};

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  applyValue(target.value);
};

const handlePaste = (e: ClipboardEvent) => {
  if (!props.sanitise) return;
  e.preventDefault();
  const pasted = e.clipboardData?.getData("text") || "";
  applyValue(pasted);
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    emit("confirm", value.value);
  } else if (e.key === "Escape") {
    e.preventDefault();
    emit("escape");
  }
};

const handleFocus = () => {
  isFocused.value = true;
  emit("focus");
};

const handleBlur = () => {
  isFocused.value = false;
  emit("blur", value.value);
};

const handleConfirmClick = () => {
  emit("confirm", value.value);
};

const wrapClasses = computed(() => ["ns-input-wrap", props.className].filter(Boolean).join(" "));
const inputClasses = computed(() => [
  "ns-input",
  `ns-input--${props.type}`,
  isFocused.value ? "ns-input--focused" : undefined,
  props.inputClassName,
].filter(Boolean).join(" "));

const inputMode = computed(() => {
  switch (props.type) {
    case "tel": return "tel";
    case "email": return "email";
    case "number": return "numeric";
    default: return undefined;
  }
});
</script>

<template>
  <span :class="wrapClasses">
    <input
      ref="inputRef"
      :id="`ns-field-${fieldKey}`"
      :class="inputClasses"
      :type="type === 'number' ? 'text' : type"
      :inputmode="inputMode"
      :value="value"
      :placeholder="placeholder"
      @input="handleChange"
      @keydown="handleKeyDown"
      @focus="handleFocus"
      @blur="handleBlur"
      @paste="handlePaste"
      autocomplete="off"
      :aria-label="fieldKey"
    />
    <EnterButton @confirm="handleConfirmClick" />
    <span v-if="suffix" class="ns-suffix">{{ suffix }}</span>
  </span>
</template>
