<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import type { NarrativeField, FieldStatus, NarrativeTypewriter, NarrativeFieldValues } from "@viveksinghind/narrative-form-core";
import { validateField, validateFieldAsync, hasAsyncValidation } from "@viveksinghind/narrative-form-core";
import ErrorMessage from "./ErrorMessage.vue";

const props = defineProps<{
  field: NarrativeField;
  status: FieldStatus;
  value: any;
  allValues: NarrativeFieldValues;
  typewriter: NarrativeTypewriter;
  editable: boolean;
  locked: boolean;
  editLabel: string;
}>();

const emit = defineEmits<{
  (e: "typingComplete", key: string): void;
  (e: "confirm", key: string, value: string): void;
  (e: "edit", key: string): void;
  (e: "error", key: string, error: string): void;
  (e: "change", key: string, value: string): void;
  (e: "focus", key: string): void;
  (e: "blur", key: string, value: string): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const typedPrompt = ref("");
const localValue = ref(props.value ? String(props.value) : "");
const errorMsg = ref<string | null>(null);
const isValidating = ref(false);

let interval: ReturnType<typeof setInterval>;

// Sync external value
watch(() => props.value, (newVal) => {
  if (newVal !== undefined && String(newVal) !== localValue.value) {
    localValue.value = String(newVal);
  }
});

// Typewriter
watch(() => props.status, (newStatus) => {
  if (newStatus === "typing") {
    if (!props.typewriter.enabled) {
      typedPrompt.value = props.field.prompt;
      emit("typingComplete", props.field.key);
      return;
    }

    let i = 0;
    interval = setInterval(() => {
      typedPrompt.value = props.field.prompt.slice(0, i + 1);
      i++;
      if (i >= props.field.prompt.length) {
        clearInterval(interval);
        emit("typingComplete", props.field.key);
      }
    }, props.typewriter.speed ?? 30);
  } else if (newStatus === "active" || newStatus === "editing") {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
}, { immediate: true });

onUnmounted(() => {
  clearInterval(interval);
});

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  localValue.value = target.value;
  emit("change", props.field.key, target.value);
  if (errorMsg.value) {
    errorMsg.value = null;
  }
};

const handleConfirm = async () => {
  const syncResult = validateField(props.field, localValue.value);
  if (!syncResult.valid) {
    errorMsg.value = syncResult.error || "Invalid input";
    emit("error", props.field.key, errorMsg.value);
    return;
  }

  if (hasAsyncValidation(props.field)) {
    isValidating.value = true;
    const asyncResult = await validateFieldAsync(props.field, localValue.value);
    isValidating.value = false;
    
    if (!asyncResult.valid) {
      errorMsg.value = asyncResult.error || "Invalid input";
      emit("error", props.field.key, errorMsg.value);
      return;
    }
  }

  errorMsg.value = null;
  emit("confirm", props.field.key, localValue.value);
};

</script>

<template>
  <div class="ns-line fade-in">
    <div class="ns-prompt-row">
      <span class="ns-prompt">
        {{ status === "typing" ? typedPrompt : field.prompt }}
      </span>
      
      <span v-if="status === 'confirmed'" class="ns-value">
        {{ localValue }}
      </span>
      
      <button 
        v-if="status === 'confirmed' && editable && !locked"
        type="button" 
        class="ns-edit-btn" 
        @click="emit('edit', field.key)"
      >
        {{ editLabel }}
      </button>
    </div>

    <div v-if="status === 'active' || status === 'editing'" class="ns-input-row">
      <input
        ref="inputRef"
        :type="field.type === 'email' ? 'email' : (field.type === 'password' ? 'password' : 'text')"
        class="ns-input"
        :disabled="isValidating"
        :value="localValue"
        @input="onInput"
        @focus="emit('focus', field.key)"
        @blur="emit('blur', field.key, localValue)"
        @keydown.enter.prevent="handleConfirm"
      />
    </div>
    
    <ErrorMessage :message="errorMsg" />
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.ns-line {
  margin: 1rem 0;
}
.ns-prompt-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.ns-prompt {
  font-size: 1.125rem;
  margin-right: 0.5rem;
}
.ns-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #007bff;
  margin-right: 0.5rem;
}
.ns-edit-btn {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: rgba(0,0,0,0.05);
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: bold;
}
.ns-input-row {
  margin-top: 0.5rem;
}
.ns-input {
  font-size: 1.125rem;
  padding: 0.5rem 0;
  border: none;
  border-bottom: 2px solid #007bff;
  outline: none;
  width: 100%;
  background: transparent;
}
.ns-input:disabled {
  border-bottom-color: #ccc;
}
</style>
