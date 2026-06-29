<script setup lang="ts">
import type { NarrativeErrorDisplay } from "@viveksinghind/narrative-form-core";

defineProps<{
  message: string | null;
  config?: NarrativeErrorDisplay;
}>();
</script>

<template>
  <transition name="fade-slide">
    <div v-if="message" class="ns-error-wrapper">
      <p class="ns-error-text">{{ message }}</p>
    </div>
  </transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.ns-error-text {
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 4px;
}
</style>
