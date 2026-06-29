<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from "vue";

const props = withDefaults(defineProps<{
  fieldKey: string;
  otpLength?: number;
  autoAdvance?: boolean;
  onRequest?: () => void | Promise<void>;
  onVerify?: (otp: string) => void | Promise<void>;
  resendLabel?: string;
  resendDelay?: number;
  className?: string;
}>(), {
  otpLength: 6,
  autoAdvance: true,
  resendLabel: "Resend code",
  resendDelay: 30,
});

const emit = defineEmits<{
  (e: "confirm", value: string): void;
  (e: "change", value: string): void;
}>();

const digits = ref<string[]>(Array.from({ length: props.otpLength }, () => ""));
const activeIndex = ref(0);
const timer = ref(props.resendDelay);
const canResend = ref(false);
const inputRefs = ref<(HTMLInputElement | null)[]>([]);
let timerInterval: ReturnType<typeof setInterval> | null = null;
const hasRequested = ref(false);

const startTimer = () => {
  if (props.resendDelay <= 0) {
    canResend.value = true;
    return;
  }
  
  timer.value = props.resendDelay;
  canResend.value = false;
  
  if (timerInterval !== null) clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    timer.value -= 1;
    if (timer.value <= 0) {
      if (timerInterval !== null) clearInterval(timerInterval);
      canResend.value = true;
    }
  }, 1000);
};

onMounted(() => {
  if (!hasRequested.value) {
    hasRequested.value = true;
    props.onRequest?.();
  }
  inputRefs.value[0]?.focus();
  startTimer();
});

onUnmounted(() => {
  if (timerInterval !== null) clearInterval(timerInterval);
});

watch(() => props.resendDelay, startTimer);

const getOtpString = (d: string[]) => d.join("");

const handleDigitChange = (index: number, e: Event) => {
  const target = e.target as HTMLInputElement;
  const val = target.value;
  const digit = val.replace(/\D/g, "").slice(-1);

  digits.value[index] = digit;
  const otpString = getOtpString(digits.value);
  emit("change", otpString);

  if (digit !== "" && index < props.otpLength - 1) {
    inputRefs.value[index + 1]?.focus();
    activeIndex.value = index + 1;
  }

  if (digits.value.every((d) => d !== "")) {
    props.onVerify?.(otpString);
    if (props.autoAdvance) {
      setTimeout(() => emit("confirm", otpString), 0);
    }
  }
};

const handleKeyDown = (index: number, e: KeyboardEvent) => {
  if (e.key === "Backspace") {
    e.preventDefault();
    if (digits.value[index] !== "") {
      digits.value[index] = "";
      emit("change", getOtpString(digits.value));
    } else if (index > 0) {
      digits.value[index - 1] = "";
      inputRefs.value[index - 1]?.focus();
      activeIndex.value = index - 1;
      emit("change", getOtpString(digits.value));
    }
  } else if (e.key === "Enter") {
    e.preventDefault();
    const otpString = getOtpString(digits.value);
    if (digits.value.every((d) => d !== "")) {
      emit("confirm", otpString);
    }
  } else if (e.key === "ArrowLeft" && index > 0) {
    e.preventDefault();
    inputRefs.value[index - 1]?.focus();
    activeIndex.value = index - 1;
  } else if (e.key === "ArrowRight" && index < props.otpLength - 1) {
    e.preventDefault();
    inputRefs.value[index + 1]?.focus();
    activeIndex.value = index + 1;
  }
};

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const pastedData = e.clipboardData?.getData("text").replace(/\D/g, "").slice(0, props.otpLength) || "";
  
  if (pastedData.length === 0) return;

  for (let i = 0; i < pastedData.length; i++) {
    const char = pastedData[i];
    if (char !== undefined) {
      digits.value[i] = char;
    }
  }

  const otpString = getOtpString(digits.value);
  emit("change", otpString);

  const nextEmptyIndex = digits.value.findIndex((d) => d === "");
  const focusIndex = nextEmptyIndex === -1 ? props.otpLength - 1 : nextEmptyIndex;
  inputRefs.value[focusIndex]?.focus();
  activeIndex.value = focusIndex;

  if (digits.value.every((d) => d !== "")) {
    props.onVerify?.(otpString);
    if (props.autoAdvance) {
      setTimeout(() => emit("confirm", otpString), 0);
    }
  }
};

const handleResend = () => {
  if (!canResend.value) return;
  canResend.value = false;
  digits.value = Array.from({ length: props.otpLength }, () => "");
  activeIndex.value = 0;
  inputRefs.value[0]?.focus();
  props.onRequest?.();
  startTimer();
};

const handleFocus = (index: number) => {
  activeIndex.value = index;
};

const handleConfirmClick = () => {
  emit("confirm", getOtpString(digits.value));
};

const wrapClasses = computed(() => ["ns-otp-wrap", props.className].filter(Boolean).join(" "));
</script>

<template>
  <span :class="wrapClasses">
    <span class="ns-otp-boxes">
      <input
        v-for="(digit, index) in digits"
        :key="index"
        :ref="el => { if (el) inputRefs[index] = el as HTMLInputElement; }"
        type="text"
        inputmode="numeric"
        :maxlength="1"
        :class="[
          'ns-otp-box',
          digit !== '' ? 'ns-otp-box--filled' : undefined,
          activeIndex === index ? 'ns-otp-box--active' : undefined
        ].filter(Boolean).join(' ')"
        :value="digit"
        @input="e => handleDigitChange(index, e)"
        @keydown="e => handleKeyDown(index, e)"
        @paste="handlePaste"
        @focus="handleFocus(index)"
        autocomplete="one-time-code"
        :aria-label="`Digit ${index + 1}`"
      />
    </span>
    
    <button
      v-if="!autoAdvance && digits.every(d => d !== '')"
      type="button"
      class="ns-enter-btn"
      @click="handleConfirmClick"
      aria-label="Confirm"
    >
      ↵
    </button>
    
    <span class="ns-otp-resend-wrap">
      <button
        v-if="canResend"
        type="button"
        class="ns-otp-resend"
        @click="handleResend"
      >
        {{ resendLabel }}
      </button>
      <span v-else class="ns-otp-resend ns-otp-resend--disabled">
        <span class="ns-otp-timer">
          Resend in {{ timer }}s
        </span>
      </span>
    </span>
  </span>
</template>
