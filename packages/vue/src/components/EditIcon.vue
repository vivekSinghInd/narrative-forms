<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  label?: string;
  className?: string;
}>(), {
  label: "Edit",
});

const emit = defineEmits<{
  (e: "edit"): void;
}>();

const classes = computed(() => ["ns-edit-btn", props.className].filter(Boolean).join(" "));
</script>

<template>
  <button
    type="button"
    :class="classes"
    @click="emit('edit')"
    :aria-label="label"
    :title="label"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  </button>
</template>
