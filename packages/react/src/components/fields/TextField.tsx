/**
 * TextField — the default text input field type for narrative-form.
 *
 * @remarks
 * Wraps InlineInput with text-specific defaults.
 * This is the simplest field type — all other types build on this pattern.
 * CSS class: `ns-input--text`
 */

import React from "react";
import { InlineInput } from "../InlineInput";

/** Props for the TextField component. */
export interface TextFieldProps {
  /** Unique field key. */
  fieldKey: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Initial value (for edit mode). */
  defaultValue?: string;
  /** Suffix text after the input. */
  suffix?: string;
  /** Callback when the value is confirmed. */
  onConfirm: (value: string) => void;
  /** Callback on every keystroke. */
  onChange?: (value: string) => void;
  /** Callback when input receives focus. */
  onFocus?: () => void;
  /** Callback when input loses focus. */
  onBlur?: (value: string) => void;
  /** Additional CSS class for the input element. */
  inputClassName?: string;
  /** Additional CSS class for the wrapper. */
  className?: string;
}

/**
 * A text input field rendered inline within a sentence.
 *
 * @param props - TextField configuration
 */
export const TextField: React.FC<TextFieldProps> = function TextField(props) {
  return <InlineInput {...props} type="text" />;
};
