<script setup lang="ts">
import InlineInput from "../InlineInput.vue";

const props = defineProps<{
  fieldKey: string;
  placeholder?: string;
  defaultValue?: string;
  suffix?: string;
  inputClassName?: string;
  className?: string;
}>();

const emit = defineEmits<{
  (e: "confirm", value: string): void;
  (e: "change", value: string): void;
  (e: "focus"): void;
  (e: "blur", value: string): void;
}>();
</script>

<template>
  <InlineInput
    v-bind="props"
    type="password"
    @confirm="v => emit('confirm', v)"
    @change="v => emit('change', v)"
    @focus="emit('focus')"
    @blur="v => emit('blur', v)"
  />
</template>
