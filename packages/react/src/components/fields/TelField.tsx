/**
 * TelField — phone number input field for narrative-form.
 *
 * @remarks
 * Renders an inline input with `type="tel"` for numeric keyboard on mobile.
 * CSS class: `ns-input--tel`
 */

import React from "react";
import { InlineInput } from "../InlineInput";

/** Props for the TelField component. */
export interface TelFieldProps {
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
 * A phone number input field rendered inline within a sentence.
 *
 * @param props - TelField configuration
 */
export const TelField: React.FC<TelFieldProps> = function TelField(props) {
  return <InlineInput {...props} type="tel" />;
};
