import type { FieldValidation } from "./types";

export function validateField(
  value: string,
  rules: FieldValidation | undefined,
  allValues: Record<string, string>
): string | null {
  if (!rules) return null;

  if (rules.required && !value.trim()) {
    return rules.requiredMessage || "This field is required";
  }
  if (!value.trim() && !rules.required) return null;

  if (rules.minLength && value.trim().length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`;
  }
  if (rules.maxLength && value.trim().length > rules.maxLength) {
    return `Must be under ${rules.maxLength} characters`;
  }
  if (rules.exactLength && value.trim().length !== rules.exactLength) {
    return rules.exactLengthMessage || `Must be exactly ${rules.exactLength} characters`;
  }
  if (rules.isEmail) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    if (!ok) return rules.isEmailMessage || "Enter a valid email";
  }
  if (rules.pattern && !rules.pattern.test(value.trim())) {
    return rules.patternMessage || "Invalid format";
  }
  if (rules.custom) {
    const res = rules.custom(value, allValues);
    if (res !== true) return res;
  }
  return null;
}
