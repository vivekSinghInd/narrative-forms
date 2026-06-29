/**
 * PasswordField — masked password input for narrative-form.
 *
 * @remarks
 * Renders an inline input with `type="password"` and a show/hide toggle.
 * CSS classes: `ns-input--password`, `ns-password-toggle`
 */

import React, { useState } from "react";
import { InlineInput } from "../InlineInput";

/** Props for the PasswordField component. */
export interface PasswordFieldProps {
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
  /** Whether to show a show/hide toggle. Default: true */
  showToggle?: boolean;
  /** Additional CSS class for the input element. */
  inputClassName?: string;
  /** Additional CSS class for the wrapper. */
  className?: string;
}

/**
 * A masked password input field with optional show/hide toggle.
 *
 * @param props - PasswordField configuration
 */
export const PasswordField: React.FC<PasswordFieldProps> = function PasswordField({
  showToggle = true,
  inputClassName,
  ...props
}) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((prev) => !prev);
  };

  const combinedClassName = [
    inputClassName,
    "ns-input--password",
  ].filter(Boolean).join(" ");

  return (
    <span className="ns-password-wrap">
      <InlineInput
        {...props}
        type={visible ? "text" : "password"}
        inputClassName={combinedClassName}
      />
      {showToggle && (
        <button
          type="button"
          className="ns-password-toggle"
          onClick={toggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? "Hide" : "Show"}
        </button>
      )}
    </span>
  );
};
