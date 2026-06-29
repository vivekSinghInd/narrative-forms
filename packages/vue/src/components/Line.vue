<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import type { NarrativeField, FieldStatus, NarrativeTypewriter, NarrativeFieldValues } from "@viveksinghind/narrative-form-core";
import { validateField, validateFieldAsync, hasAsyncValidation } from "@viveksinghind/narrative-form-core";
import ErrorMessage from "./ErrorMessage.vue";
import Prose from "./Prose.vue";
import FilledValue from "./FilledValue.vue";
import ChipsField from "./fields/ChipsField.vue";
import MultiChipsField from "./fields/MultiChipsField.vue";
import SelectField from "./fields/SelectField.vue";
import OtpField from "./fields/OtpField.vue";
import PasswordField from "./fields/PasswordField.vue";
import DateField from "./fields/DateField.vue";
import TextField from "./fields/TextField.vue";
import EmailField from "./fields/EmailField.vue";
import NumberField from "./fields/NumberField.vue";
import TelField from "./fields/TelField.vue";
import InlineInput from "./InlineInput.vue";

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

const fieldComponentMap: Record<string, any> = {
  chips: ChipsField,
  "multi-chips": MultiChipsField,
  select: SelectField,
  otp: OtpField,
  password: PasswordField,
  date: DateField,
  text: TextField,
  email: EmailField,
  number: NumberField,
  tel: TelField,
};

const currentFieldComponent = computed(() => {
  return fieldComponentMap[props.field.type] || InlineInput;
});

const localValue = ref(props.value !== undefined ? props.value : "");
const errorMsg = ref<string | null>(null);
const isValidating = ref(false);

const isFieldEditable = computed(() => props.field.editable !== false && props.editable && !props.locked);
const shouldAnimate = computed(() => props.field.animate !== false && props.typewriter?.enabled !== false);

// Sync external value
watch(() => props.value, (newVal) => {
  if (newVal !== undefined && newVal !== localValue.value) {
    localValue.value = newVal;
  }
});

const handleTypingComplete = () => {
  if (props.status === "typing") {
    emit("typingComplete", props.field.key);
  }
};

const handleFieldChange = (val: any) => {
  localValue.value = val;
  const strVal = Array.isArray(val) ? val.join(", ") : String(val);
  emit("change", props.field.key, strVal);
  if (errorMsg.value) {
    errorMsg.value = null;
  }
};

const handleConfirmVal = async (val: any) => {
  localValue.value = val;
  const strVal = Array.isArray(val) ? val.join(", ") : String(val);

  const syncResult = validateField(props.field, val, props.allValues);
  if (!syncResult.valid) {
    errorMsg.value = syncResult.error || "Invalid input";
    emit("error", props.field.key, errorMsg.value);
    return;
  }

  if (hasAsyncValidation(props.field)) {
    isValidating.value = true;
    const asyncResult = await validateFieldAsync(props.field, val, props.allValues);
    isValidating.value = false;
    
    if (!asyncResult.valid) {
      errorMsg.value = asyncResult.error || "Invalid input";
      emit("error", props.field.key, errorMsg.value);
      return;
    }
  }

  errorMsg.value = null;
  emit("confirm", props.field.key, strVal);
};

const handleEdit = () => {
  errorMsg.value = null;
  emit("edit", props.field.key);
};
</script>

<template>
  <div :class="['ns-line fade-in', field.className]">
    <div class="ns-prompt-row">
      <Prose
        :text="field.prefix || field.prompt || ''"
        :animate="status === 'typing' && shouldAnimate"
        :speed="typewriter?.speed"
        :cursor="typewriter?.cursor !== false"
        :cursorChar="typewriter?.cursorChar"
        :pauseAfter="typewriter?.pauseAfter"
        @complete="handleTypingComplete"
      />
      
      <FilledValue
        v-if="status === 'confirmed'"
        :value="Array.isArray(localValue) ? localValue.join(', ') : String(localValue)"
        :suffix="field.suffix"
        :editable="isFieldEditable"
        :editLabel="editLabel"
        @edit="handleEdit"
      />
    </div>

    <div v-if="status === 'active' || status === 'editing'" class="ns-input-row">
      <component
        :is="currentFieldComponent"
        :fieldKey="field.key"
        :type="field.type"
        :placeholder="field.placeholder"
        :defaultValue="status === 'editing' ? localValue : field.defaultValue"
        :suffix="field.suffix"
        :options="field.options"
        :otpLength="field.otpLength"
        :autoAdvance="field.autoAdvance"
        :resendLabel="field.resendLabel"
        :resendDelay="field.resendDelay"
        :sanitise="field.sanitise"
        :inputClassName="field.inputClassName"
        :disabled="isValidating"
        @confirm="handleConfirmVal"
        @change="handleFieldChange"
        @focus="emit('focus', field.key)"
        @blur="(v: string) => emit('blur', field.key, v)"
        @request="field.onRequest && field.onRequest()"
        @verify="field.onVerify && field.onVerify($event)"
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
.ns-input-row {
  margin-top: 0.5rem;
}
</style>
