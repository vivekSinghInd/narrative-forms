<script setup lang="ts">
import { computed } from "vue";
import { useTypewriter } from "../composables/useTypewriter";
import Cursor from "./Cursor.vue";

const props = withDefaults(defineProps<{
  text: string;
  animate?: boolean;
  speed?: number;
  cursor?: boolean;
  cursorChar?: string;
  pauseAfter?: number;
  className?: string;
}>(), {
  animate: true,
  speed: 38,
  cursor: true,
  cursorChar: "|",
  pauseAfter: 100,
});

const emit = defineEmits<{
  (e: "complete"): void;
}>();

const { displayedText, isTyping } = useTypewriter({
  text: () => props.text,
  speed: props.speed,
  enabled: props.animate,
  pauseAfter: props.pauseAfter,
  onComplete: () => emit("complete")
});

const classes = computed(() => [
  "ns-prose",
  isTyping.value ? "ns-prose--typing" : undefined,
  props.className
].filter(Boolean).join(" "));
</script>

<template>
  <span :class="classes">
    {{ displayedText }}
    <Cursor v-if="cursor && isTyping" :cursorChar="cursorChar" />
  </span>
</template>
