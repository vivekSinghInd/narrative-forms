/**
 * EmailField — email input field for narrative-form.
 *
 * @remarks
 * Renders an inline input with `type="email"` for email keyboard on mobile.
 * CSS class: `ns-input--email`
 */

import React from "react";
import { InlineInput } from "../InlineInput";

/** Props for the EmailField component. */
export interface EmailFieldProps {
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
 * An email input field rendered inline within a sentence.
 *
 * @param props - EmailField configuration
 */
export const EmailField: React.FC<EmailFieldProps> = function EmailField(props) {
  return <InlineInput {...props} type="email" />;
};
