<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const props = withDefaults(defineProps<{
  fieldKey: string;
  options: string[];
  placeholder?: string;
  defaultValue?: string;
  autoAdvance?: boolean;
  inputClassName?: string;
  className?: string;
}>(), {
  placeholder: "Select…",
  defaultValue: "",
  autoAdvance: false,
});

const emit = defineEmits<{
  (e: "confirm", value: string): void;
  (e: "change", value: string): void;
  (e: "focus"): void;
  (e: "blur", value: string): void;
}>();

const value = ref(props.defaultValue);
const selectRef = ref<HTMLSelectElement | null>(null);

onMounted(() => {
  selectRef.value?.focus();
});

const handleChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  const newValue = target.value;
  value.value = newValue;
  emit("change", newValue);

  if (props.autoAdvance && newValue !== "") {
    emit("confirm", newValue);
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && value.value !== "") {
    e.preventDefault();
    emit("confirm", value.value);
  }
};

const handleConfirmClick = () => {
  if (value.value !== "") {
    emit("confirm", value.value);
  }
};

const wrapClasses = computed(() => ["ns-select-wrap", props.className].filter(Boolean).join(" "));
const selectClasses = computed(() => ["ns-select", props.inputClassName].filter(Boolean).join(" "));
</script>

<template>
  <span :class="wrapClasses">
    <select
      ref="selectRef"
      :id="`ns-field-${fieldKey}`"
      :class="selectClasses"
      :value="value"
      @change="handleChange"
      @keydown="handleKeyDown"
      @focus="emit('focus')"
      @blur="emit('blur', value)"
      :aria-label="fieldKey"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <button
      v-if="!autoAdvance && value !== ''"
      type="button"
      class="ns-enter-btn"
      @click="handleConfirmClick"
      aria-label="Confirm"
    >
      ↵
    </button>
  </span>
</template>
