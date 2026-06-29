// All TypeScript interfaces for narrative-form
// Exported for developer use
export interface NarrativeErrorDisplay {
  mode?: "inline" | "toast" | "shake" | "inline+shake" | "tooltip";
  position?: "below" | "above";
  icon?: boolean;
  iconChar?: string;
  animateIn?: "fadeUp" | "slideDown" | "none";
  clearOn?: "onChange" | "onFocus";
}

export interface NarrativeField {
  key: string;
  type: NarrativeFieldType;
  prefix: string;
  suffix?: string;
  placeholder?: string;
  order?: number;
  options?: string[];
  animate?: boolean;
  autoAdvance?: boolean;
  lockPrevious?: boolean;
  showIf?: (values: NarrativeFieldValues) => boolean;
  className?: string;
  inputClassName?: string;
  editable?: boolean;
  defaultValue?: string;
  validation?: NarrativeValidation;
  sanitise?: (value: string) => string;
  format?: (value: string) => string;
  // OTP-specific properties
  otpLength?: number;
  onRequest?: () => void | Promise<void>;
  onVerify?: (otp: string) => void | Promise<void>;
  resendLabel?: string;
  resendDelay?: number;
}

export type NarrativeFieldType =
  | "text"
  | "tel"
  | "email"
  | "password"
  | "number"
  | "select"
  | "chips"
  | "multi-chips"
  | "date"
  | "otp";

export interface NarrativeValidation {
  required?: boolean;
  requiredMessage?: string;
  minLength?: number;
  minLengthMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
  exactLength?: number;
  exactLengthMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
  isEmail?: boolean;
  isEmailMessage?: string;
  min?: number;
  minMessage?: string;
  max?: number;
  maxMessage?: string;
  custom?: (value: string, allValues: NarrativeFieldValues) => boolean | string | Promise<boolean | string>;
  rules?: NarrativeValidationRule[];
  mode?: "bail" | "all";
  trigger?: "onChange" | "onBlur" | "onSubmit" | "onConfirm" | "debounced";
  debounceMs?: number;
  errorDisplay?: NarrativeErrorDisplay;
  use?: string | string[];
  serverValidate?: NarrativeServerValidation;
  loadingText?: string;
  successIndicator?: boolean;
}

export interface NarrativeValidationRule {
  name: string;
  validate: (value: string, allValues: NarrativeFieldValues) => boolean | string | Promise<boolean | string>;
  message?: string;
  async?: boolean;
  debounce?: number;
}

export interface NarrativeServerValidation {
  url: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  debounceMs?: number;
  timeout?: number;
  timeoutMessage?: string;
  responsePath: string;
  errorPath: string;
}

export interface NarrativeTheme {
  background?: string;
  textColor?: string;
  inputBorderColor?: string;
  placeholderColor?: string;
  errorColor?: string;
  filledColor?: string;
  cursorColor?: string;
  successColor?: string;
  loadingColor?: string;
  fontFamily?: string;
  uiFontFamily?: string;
  fontSize?: string;
  mobileFontSize?: string;
  inputFontStyle?: string;
  lineGap?: string;
  pagePadding?: string;
  buttonRadius?: string;
  buttonBackground?: string;
  buttonColor?: string;
  enterBtnSize?: string;
  chipBorderRadius?: string;
  chipBorderColor?: string;
  chipActiveBackground?: string;
  chipActiveColor?: string;
  chipFontStyle?: string;
  mode?: "light" | "dark" | "auto";
  dark?: Partial<NarrativeTheme>;
}

export interface NarrativeTypewriter {
  enabled?: boolean;
  speed?: number;
  cursor?: boolean;
  cursorChar?: string;
  pauseAfter?: number;
}

export interface NarrativeWelcome {
  show?: boolean;
  heading?: string;
  subtext?: string;
  ctaLabel?: string;
}

export interface NarrativeDone {
  show?: boolean;
  message?: string | ((values: NarrativeFieldValues) => string);
  ctaLabel?: string;
  onSubmit?: (values: NarrativeFieldValues, meta: NarrativeMeta) => void | Promise<void>;
}

export interface NarrativeFormConfig {
  form: { id: string; name: string; version: number };
  welcome?: NarrativeWelcome;
  fields: NarrativeField[];
  theme?: NarrativeTheme;
  done?: NarrativeDone;
}

export interface NarrativeMeta {
  formId?: string;
  formVersion?: number;
  totalTimeMs: number;
  fieldTimings: Record<string, number>;
}

export interface NarrativeFieldValues {
  [key: string]: string | string[];
}

export interface NarrativeI18n {
  editLabel?: string;
  requiredMessage?: string;
  otpResend?: string;
  otpTimer?: string;
  submitLabel?: string;
  loadingLabel?: string;
  successLabel?: string;
  retryLabel?: string;
  fetchErrorMessage?: string;
}

export interface NarrativeRefHandle {
  next: () => void;
  getValues: () => NarrativeFieldValues;
  reset: () => void;
  focusField: (key: string) => void;
}

/** Cross-field validation rule that validates across multiple fields. */
export interface NarrativeCrossFieldValidator {
  /** Fields this validator watches. */
  fields: string[];
  /** Field key where the error should be displayed. */
  errorField: string;
  /** Validation function receiving all values. */
  validate: (values: NarrativeFieldValues) => boolean | string | Promise<boolean | string>;
  /** Fallback error message. */
  message?: string;
}

export interface NarrativeCallbacks {
  onChange?: (key: string, value: string) => void;
  onFieldFocus?: (key: string) => void;
  onFieldBlur?: (key: string, value: string) => void;
  onFieldComplete?: (key: string, value: string, timeSpentMs: number) => void;
  onEdit?: (key: string) => void;
  onError?: (key: string, message: string) => void;
  onDropOff?: (lastFieldKey: string) => void;
  onComplete?: (values: NarrativeFieldValues, meta: NarrativeMeta) => void;
}
