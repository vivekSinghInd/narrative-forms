<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(defineProps<{
  fieldKey: string;
  options: string[];
  defaultValue?: string[];
  className?: string;
}>(), {
  defaultValue: () => [],
});

const emit = defineEmits<{
  (e: "confirm", value: string): void;
  (e: "change", value: string): void;
}>();

const selected = ref<Set<string>>(new Set(props.defaultValue));
const hoveredIndex = ref<number | null>(null);

const handleToggle = (option: string) => {
  if (selected.value.has(option)) {
    selected.value.delete(option);
  } else {
    selected.value.add(option);
  }
  const value = Array.from(selected.value).join(", ");
  emit("change", value);
};

const handleConfirm = () => {
  if (selected.value.size > 0) {
    emit("confirm", Array.from(selected.value).join(", "));
  }
};

const handleKeyDown = (e: KeyboardEvent, option: string) => {
  if (e.key === "Enter" && selected.value.size > 0) {
    e.preventDefault();
    handleConfirm();
  } else if (e.key === " ") {
    e.preventDefault();
    handleToggle(option);
  }
};

const wrapClasses = computed(() => ["ns-chips-wrap", props.className].filter(Boolean).join(" "));
</script>

<template>
  <span :class="wrapClasses">
    <button
      v-for="(option, index) in options"
      :key="option"
      type="button"
      :class="[
        'ns-chip',
        selected.has(option) ? 'ns-chip--active' : undefined,
        hoveredIndex === index ? 'ns-chip--hover' : undefined
      ].filter(Boolean).join(' ')"
      @click="handleToggle(option)"
      @keydown="e => handleKeyDown(e, option)"
      @mouseenter="hoveredIndex = index"
      @mouseleave="hoveredIndex = null"
      :aria-pressed="selected.has(option)"
      role="option"
    >
      {{ option }}
    </button>
    <button
      v-if="selected.size > 0"
      type="button"
      class="ns-enter-btn"
      @click="handleConfirm"
      aria-label="Confirm"
    >
      ↵
    </button>
  </span>
</template>
