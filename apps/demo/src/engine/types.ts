export type FieldType =
  | "text"
  | "tel"
  | "email"
  | "password"
  | "number"
  | "chips"
  | "otp";

export interface FieldValidation {
  required?: boolean;
  requiredMessage?: string;
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  exactLengthMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
  isEmail?: boolean;
  isEmailMessage?: string;
  custom?: (value: string, allValues: Record<string, string>) => true | string;
}

export interface NarrativeField {
  key: string;
  type: FieldType;
  prefix: string;
  suffix?: string;
  placeholder?: string;
  options?: string[];
  autoAdvance?: boolean;
  validation?: FieldValidation;
  sanitise?: (v: string) => string;
}

export interface NarrativeTheme {
  background?: string;
  textColor?: string;
  inputBorderColor?: string;
  placeholderColor?: string;
  errorColor?: string;
  fontFamily?: string;
  uiFontFamily?: string;
  accent?: string;
}
