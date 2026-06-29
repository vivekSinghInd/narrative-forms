/**
 * NumberField — numeric input field for narrative-form.
 *
 * @remarks
 * Renders an inline input with `type="number"` for numeric entry.
 * CSS class: `ns-input--number`
 */

import React from "react";
import { InlineInput } from "../InlineInput";

/** Props for the NumberField component. */
export interface NumberFieldProps {
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
 * A numeric input field rendered inline within a sentence.
 *
 * @param props - NumberField configuration
 */
export const NumberField: React.FC<NumberFieldProps> = function NumberField(props) {
  return <InlineInput {...props} type="number" />;
};
