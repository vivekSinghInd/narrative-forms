<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  cursorChar?: string;
  className?: string;
}>(), {
  cursorChar: "|",
});

const classes = computed(() => ["ns-cursor", props.className].filter(Boolean).join(" "));
</script>

<template>
  <span :class="classes" aria-hidden="true">{{ cursorChar }}</span>
</template>
