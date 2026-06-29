/**
 * DateField — inline date picker for narrative-form.
 *
 * @remarks
 * Renders a native date picker inline.
 * CSS classes: `ns-input-wrap`, `ns-input`, `ns-input--date`
 */

import React from "react";
import { InlineInput } from "../InlineInput";

export interface DateFieldProps {
  fieldKey: string;
  placeholder?: string;
  defaultValue?: string;
  suffix?: string;
  onConfirm: (value: string) => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: (value: string) => void;
  inputClassName?: string;
  className?: string;
}

export const DateField: React.FC<DateFieldProps> = function DateField({
  fieldKey,
  placeholder,
  defaultValue,
  suffix,
  onConfirm,
  onChange,
  onFocus,
  onBlur,
  inputClassName,
  className,
}) {
  return (
    <InlineInput
      fieldKey={fieldKey}
      type="date"
      placeholder={placeholder}
      defaultValue={defaultValue}
      suffix={suffix}
      onConfirm={onConfirm}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      inputClassName={inputClassName}
      className={className}
    />
  );
};
