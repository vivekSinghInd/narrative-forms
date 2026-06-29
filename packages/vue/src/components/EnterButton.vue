<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  label?: string;
  className?: string;
}>(), {
  label: "↵",
});

const emit = defineEmits<{
  (e: "confirm"): void;
}>();

const classes = computed(() => {
  return ["ns-enter-btn", props.className].filter(Boolean).join(" ");
});
</script>

<template>
  <button
    type="button"
    :class="classes"
    @click="emit('confirm')"
    aria-label="Confirm"
  >
    {{ label }}
  </button>
</template>
