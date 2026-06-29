<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(defineProps<{
  fieldKey: string;
  options: string[];
  defaultValue?: string;
  autoAdvance?: boolean;
  className?: string;
}>(), {
  autoAdvance: false,
});

const emit = defineEmits<{
  (e: "confirm", value: string): void;
  (e: "change", value: string): void;
}>();

const selected = ref<string | null>(props.defaultValue ?? null);
const focusedIndex = ref<number>(0);
const chipsRef = ref<(HTMLButtonElement | null)[]>([]);

const handleSelect = (option: string) => {
  selected.value = option;
  emit("change", option);

  if (props.autoAdvance) {
    emit("confirm", option);
  }
};

const handleConfirm = () => {
  if (selected.value !== null) {
    emit("confirm", selected.value);
  }
};

const handleKeyDown = (e: KeyboardEvent, index: number) => {
  switch (e.key) {
    case "Enter":
    case " ": {
      e.preventDefault();
      const option = props.options[index];
      if (option) handleSelect(option);
      break;
    }
    case "ArrowRight":
    case "ArrowDown": {
      e.preventDefault();
      const nextIndex = (index + 1) % props.options.length;
      focusedIndex.value = nextIndex;
      chipsRef.value[nextIndex]?.focus();
      break;
    }
    case "ArrowLeft":
    case "ArrowUp": {
      e.preventDefault();
      const prevIndex = (index - 1 + props.options.length) % props.options.length;
      focusedIndex.value = prevIndex;
      chipsRef.value[prevIndex]?.focus();
      break;
    }
  }
};

const wrapClasses = computed(() => ["ns-chips-wrap", props.className].filter(Boolean).join(" "));
</script>

<template>
  <span :class="wrapClasses" role="listbox" :aria-label="fieldKey">
    <button
      v-for="(option, index) in options"
      :key="option"
      type="button"
      :class="['ns-chip', selected === option ? 'ns-chip--active' : undefined].filter(Boolean).join(' ')"
      @click="handleSelect(option)"
      @keydown="e => handleKeyDown(e, index)"
      :aria-selected="selected === option"
      role="option"
      :tabindex="index === focusedIndex ? 0 : -1"
      :ref="el => { if (el) chipsRef[index] = el as HTMLButtonElement; }"
    >
      {{ option }}
    </button>
    <button
      v-if="!autoAdvance && selected !== null"
      type="button"
      class="ns-enter-btn"
      @click="handleConfirm"
      aria-label="Confirm"
      style="opacity: 1; transform: none;"
    >
      ↵
    </button>
  </span>
</template>
