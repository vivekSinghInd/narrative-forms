/**
 * Base inline input component for narrative-form.
 *
 * @remarks
 * Renders an inline text input that appears after the typewriter finishes.
 * Handles Enter key to confirm, Escape to cancel, and auto-focuses when it mounts.
 * Supports sanitise function on input and paste events.
 * CSS classes: `ns-input-wrap`, `ns-input`, `ns-input--[type]`, `ns-input--focused`
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { EnterButton } from "./EnterButton";

/** Props for the InlineInput component. */
export interface InlineInputProps {
  /** Unique field key used for identification. */
  fieldKey: string;
  /** HTML input type attribute. Default: "text" */
  type?: string;
  /** Placeholder text inside the input. */
  placeholder?: string;
  /** Initial value for the input. */
  defaultValue?: string;
  /** Suffix text displayed after the input. */
  suffix?: string;
  /** Sanitise function applied on input and paste. */
  sanitise?: (value: string) => string;
  /** Callback fired when the value is confirmed (Enter key or button). */
  onConfirm: (value: string) => void;
  /** Callback fired on every keystroke. */
  onChange?: (value: string) => void;
  /** Callback fired when input receives focus. */
  onFocus?: () => void;
  /** Callback fired when input loses focus. */
  onBlur?: (value: string) => void;
  /** Callback fired when Escape is pressed (cancel edit). */
  onEscape?: () => void;
  /** Additional CSS class for the input element. */
  inputClassName?: string;
  /** Additional CSS class for the wrapper. */
  className?: string;
}

/**
 * An inline input that lives within a sentence.
 * Auto-focuses on mount and confirms on Enter key press.
 *
 * @param props - Input configuration
 */
export const InlineInput: React.FC<InlineInputProps> = function InlineInput({
  fieldKey,
  type = "text",
  placeholder,
  defaultValue = "",
  suffix,
  sanitise,
  onConfirm,
  onChange,
  onFocus,
  onBlur,
  onEscape,
  inputClassName,
  className,
}) {
  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when input appears
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const applyValue = useCallback(
    (raw: string) => {
      const cleaned = sanitise ? sanitise(raw) : raw;
      setValue(cleaned);
      onChange?.(cleaned);
    },
    [sanitise, onChange],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyValue(e.target.value);
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (!sanitise) return; // Let default paste behaviour work
      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      applyValue(pasted);
    },
    [sanitise, applyValue],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onConfirm(value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onEscape?.();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.(value);
  };

  const handleConfirmClick = () => {
    onConfirm(value);
  };

  const wrapClasses = ["ns-input-wrap", className].filter(Boolean).join(" ");
  const inputClasses = [
    "ns-input",
    `ns-input--${type}`,
    isFocused ? "ns-input--focused" : undefined,
    inputClassName,
  ]
    .filter(Boolean)
    .join(" ");

  // Map field type to appropriate inputMode
  const inputMode = (() => {
    switch (type) {
      case "tel": return "tel" as const;
      case "email": return "email" as const;
      case "number": return "numeric" as const;
      default: return undefined;
    }
  })();

  return (
    <span className={wrapClasses}>
      <input
        ref={inputRef}
        id={`ns-field-${fieldKey}`}
        className={inputClasses}
        type={type === "number" ? "text" : type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        autoComplete="off"
        aria-label={fieldKey}
        aria-invalid={undefined}
      />
      <EnterButton onConfirm={handleConfirmClick} />
      {suffix && <span className="ns-suffix">{suffix}</span>}
    </span>
  );
};
