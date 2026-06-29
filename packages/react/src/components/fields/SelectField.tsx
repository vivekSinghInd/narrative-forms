/**
 * SelectField — inline dropdown for narrative-form.
 *
 * @remarks
 * Renders a native `<select>` element inline within a sentence.
 * CSS classes: `ns-select-wrap`, `ns-select`
 */

import React, { useState, useRef, useEffect, useCallback } from "react";

/** Props for the SelectField component. */
export interface SelectFieldProps {
  /** Unique field key. */
  fieldKey: string;
  /** Array of option labels. */
  options: string[];
  /** Placeholder text for the default empty option. */
  placeholder?: string;
  /** Currently selected value (for edit mode). */
  defaultValue?: string;
  /** Whether to auto-confirm on selection. Default: false */
  autoAdvance?: boolean;
  /** Callback when a value is confirmed. */
  onConfirm: (value: string) => void;
  /** Callback on selection change. */
  onChange?: (value: string) => void;
  /** Callback when input receives focus. */
  onFocus?: () => void;
  /** Callback when input loses focus. */
  onBlur?: (value: string) => void;
  /** Additional CSS class for the select element. */
  inputClassName?: string;
  /** Additional CSS class for the wrapper. */
  className?: string;
}

/**
 * An inline dropdown select field rendered within a sentence.
 *
 * @param props - SelectField configuration
 */
export const SelectField: React.FC<SelectFieldProps> = function SelectField({
  fieldKey,
  options,
  placeholder = "Select…",
  defaultValue = "",
  autoAdvance = false,
  onConfirm,
  onChange,
  onFocus,
  onBlur,
  inputClassName,
  className,
}) {
  const [value, setValue] = useState(defaultValue);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Auto-focus when select appears
  useEffect(() => {
    selectRef.current?.focus();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onChange?.(newValue);

      if (autoAdvance && newValue !== "") {
        onConfirm(newValue);
      }
    },
    [autoAdvance, onConfirm, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSelectElement>) => {
      if (e.key === "Enter" && value !== "") {
        e.preventDefault();
        onConfirm(value);
      }
    },
    [value, onConfirm],
  );

  const handleConfirmClick = useCallback(() => {
    if (value !== "") {
      onConfirm(value);
    }
  }, [value, onConfirm]);

  const wrapClasses = ["ns-select-wrap", className].filter(Boolean).join(" ");
  const selectClasses = ["ns-select", inputClassName].filter(Boolean).join(" ");

  return (
    <span className={wrapClasses}>
      <select
        ref={selectRef}
        id={`ns-field-${fieldKey}`}
        className={selectClasses}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => onFocus?.()}
        onBlur={() => onBlur?.(value)}
        aria-label={fieldKey}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {!autoAdvance && value !== "" && (
        <button
          type="button"
          className="ns-enter-btn"
          onClick={handleConfirmClick}
          aria-label="Confirm"
        >
          ↵
        </button>
      )}
    </span>
  );
};
