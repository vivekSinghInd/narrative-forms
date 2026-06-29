<script setup lang="ts">
import { ref, provide } from "vue";

export interface ToastMessage {
  id: string;
  message: string;
  icon?: boolean;
  iconChar?: string;
}

const toasts = ref<ToastMessage[]>([]);

const showToast = (message: string, icon = false, iconChar = "⚠") => {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.value.push({ id, message, icon, iconChar });

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3000);
};

const hideToast = (id: string) => {
  toasts.value = toasts.value.filter((t) => t.id !== id);
};

provide("toastContext", { showToast, hideToast });
</script>

<template>
  <slot />
  <div v-if="toasts.length > 0" class="ns-toast-container" aria-live="polite">
    <div v-for="toast in toasts" :key="toast.id" class="ns-toast ns-animate-fade-up">
      <span v-if="toast.icon" class="ns-toast-icon">{{ toast.iconChar }} </span>
      <span class="ns-toast-message">{{ toast.message }}</span>
      <button 
        type="button" 
        class="ns-toast-close" 
        @click="hideToast(toast.id)"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  </div>
</template>
