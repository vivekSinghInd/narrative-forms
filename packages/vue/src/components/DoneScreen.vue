<script setup lang="ts">
import type { NarrativeDone, NarrativeFieldValues, NarrativeMeta, NarrativeTypewriter } from "@viveksinghind/narrative-form-core";

defineProps<{
  done: NarrativeDone;
  values: NarrativeFieldValues;
  meta: NarrativeMeta;
  typewriter: NarrativeTypewriter;
}>();
</script>

<template>
  <div class="ns-done fade-in">
    <h1 class="ns-done-title">{{ typeof done.message === 'function' ? done.message(values) : done.message }}</h1>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.ns-done {
  padding: 2rem;
}
.ns-done-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.ns-done-subtitle {
  font-size: 1rem;
  opacity: 0.8;
}
</style>
