import { ref, watch, onUnmounted, computed } from "vue";

export interface UseTypewriterOptions {
  text: string | (() => string);
  speed?: number;
  enabled?: boolean;
  pauseAfter?: number;
  onComplete?: () => void;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useTypewriter(options: UseTypewriterOptions) {
  const getText = () => (typeof options.text === 'function' ? options.text() : options.text);
  const charIndex = ref(0);
  const isComplete = ref(false);
  let interval: ReturnType<typeof setInterval> | null = null;
  let pauseTimeout: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
    if (pauseTimeout !== null) {
      clearTimeout(pauseTimeout);
      pauseTimeout = null;
    }
  };

  onUnmounted(cleanup);

  watch(
    [
      () => getText(),
      () => options.speed,
      () => options.enabled,
      () => options.pauseAfter
    ],
    ([textVal, speedVal, enabledVal, pauseAfterVal]) => {
      cleanup();

      const speed = speedVal ?? 38;
      const enabled = enabledVal ?? true;
      const pauseAfter = pauseAfterVal ?? 100;
      const text = String(textVal || "");

      if (!enabled || prefersReducedMotion() || text.length === 0) {
        charIndex.value = text.length;
        isComplete.value = true;
        options.onComplete?.();
        return;
      }

      charIndex.value = 0;
      isComplete.value = false;

      interval = setInterval(() => {
        charIndex.value++;
        if (charIndex.value >= text.length) {
          if (interval !== null) {
            clearInterval(interval);
            interval = null;
          }
          pauseTimeout = setTimeout(() => {
            isComplete.value = true;
            options.onComplete?.();
          }, pauseAfter);
        }
      }, speed);
    },
    { immediate: true }
  );

  const displayedText = computed(() => getText().slice(0, charIndex.value));
  const isTyping = computed(() => charIndex.value < getText().length && !isComplete.value);

  return {
    displayedText,
    isTyping,
    isComplete
  };
}
