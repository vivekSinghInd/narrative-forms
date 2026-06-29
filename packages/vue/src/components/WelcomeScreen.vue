<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { NarrativeWelcome, NarrativeTypewriter } from "@viveksinghind/narrative-form-core";

const props = defineProps<{
  welcome: NarrativeWelcome;
  typewriter: NarrativeTypewriter;
}>();

const emit = defineEmits<{
  (e: "start"): void;
}>();

const typedTitle = ref("");
let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  if (!props.typewriter.enabled) {
    typedTitle.value = props.welcome.heading || "";
    return;
  }

  let i = 0;
  interval = setInterval(() => {
    typedTitle.value = (props.welcome.heading || "").slice(0, i + 1);
    i++;
    if (i >= (props.welcome.heading || "").length) {
      clearInterval(interval);
    }
  }, props.typewriter.speed ?? 30);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="ns-welcome fade-in">
    <h1 class="ns-welcome-title">{{ typedTitle }}</h1>
    <p v-if="welcome.subtext" class="ns-welcome-subtitle">{{ welcome.subtext }}</p>
    <button type="button" class="ns-welcome-start" @click="emit('start')">
      {{ welcome.ctaLabel || 'Start' }}
    </button>
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
.ns-welcome {
  padding: 2rem;
}
.ns-welcome-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.ns-welcome-subtitle {
  font-size: 1.125rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}
.ns-welcome-start {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
</style>
