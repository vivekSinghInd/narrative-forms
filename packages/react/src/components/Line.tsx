/**
 * Line — single sentence row orchestrator for narrative-form.
 *
 * @remarks
 * Manages the full lifecycle of a single field within the form:
 * `typing → active → confirmed → editing`.
 *
 * Composes: Prose + InlineInput (or FilledValue + EditIcon) + ErrorMessage.
 * Runs validation on confirm — blocks confirmation if validation fails.
 * Supports async validation with loading/success visual states.
 * CSS classes: `ns-line`, `ns-line--active`, `ns-line--confirmed`,
 * `ns-line--editing`, `ns-line--error`, `ns-line-[key]`
 */

import React, { useCallback, useState, useRef } from "react";
import type { NarrativeField, NarrativeTypewriter, NarrativeFieldValues } from "@viveksinghind/narrative-form-core";
import type { FieldStatus } from "@viveksinghind/narrative-form-core";
import { validateField, validateFieldAsync, hasAsyncValidation } from "@viveksinghind/narrative-form-core";
import { Prose } from "./Prose";
import { InlineInput } from "./InlineInput";
import { FilledValue } from "./FilledValue";
import { ErrorMessage } from "./ErrorMessage";
import { ChipsField } from "./fields/ChipsField";
import { MultiChipsField } from "./fields/MultiChipsField";
import { SelectField } from "./fields/SelectField";
import { OtpField } from "./fields/OtpField";
import { PasswordField } from "./fields/PasswordField";
import { DateField } from "./fields/DateField";
import { useToast } from "./ToastProvider";

/** Async validation visual state. */
type AsyncState = "idle" | "validating" | "valid" | "invalid";

/** Props for the Line component. */
export interface LineProps {
  /** The field configuration for this line. */
  field: NarrativeField;
  /** Current lifecycle status of this field. */
  status: FieldStatus;
  /** The confirmed value (if any). */
  value?: string | string[];
  /** All confirmed values so far (for cross-field validation). */
  allValues?: NarrativeFieldValues;
  /** Typewriter configuration. */
  typewriter?: NarrativeTypewriter;
  /** Whether editing is enabled globally. Default: true */
  editable?: boolean;
  /** Whether this field is locked (lockPrevious). */
  locked?: boolean;
  /** Label for the edit button. */
  editLabel?: string;
  /** Called when typing animation completes — field should become active. */
  onTypingComplete: (key: string) => void;
  /** Called when the field value is confirmed (after validation passes). */
  onConfirm: (key: string, value: string) => void;
  /** Called when the edit icon is clicked. */
  onEdit: (key: string) => void;
  /** Called when validation fails. */
  onError?: (key: string, message: string) => void;
  /** Called on every keystroke. */
  onChange?: (key: string, value: string) => void;
  /** Called when input receives focus. */
  onFocus?: (key: string) => void;
  /** Called when input loses focus. */
  onBlur?: (key: string, value: string) => void;
}

/** Helper props for the field rendering function. */
interface RenderFieldInputProps {
  field: NarrativeField;
  status: FieldStatus;
  value?: string | string[];
  handleConfirm: (val: string) => void;
  handleChange: (val: string) => void;
  handleFocus: () => void;
  handleBlur: (val: string) => void;
  handlePaste?: (val: string) => string;
}

/**
 * Renders the correct input component based on field type.
 */
function renderFieldInput({
  field,
  status,
  value,
  handleConfirm,
  handleChange,
  handleFocus,
  handleBlur,
}: RenderFieldInputProps): React.ReactNode {
  const editValue =
    status === "editing" && value !== undefined ? String(value) : field.defaultValue;

  switch (field.type) {
    case "chips":
      return (
        <ChipsField
          fieldKey={field.key}
          options={field.options ?? []}
          defaultValue={editValue}
          autoAdvance={field.autoAdvance}
          onConfirm={handleConfirm}
          onChange={handleChange}
          className={field.inputClassName}
        />
      );

    case "multi-chips":
      return (
        <MultiChipsField
          fieldKey={field.key}
          options={field.options ?? []}
          defaultValue={
            status === "editing" && Array.isArray(value)
              ? value
              : editValue?.split(", ").filter(Boolean)
          }
          onConfirm={handleConfirm}
          onChange={handleChange}
          className={field.inputClassName}
        />
      );

    case "select":
      return (
        <SelectField
          fieldKey={field.key}
          options={field.options ?? []}
          placeholder={field.placeholder}
          defaultValue={editValue}
          autoAdvance={field.autoAdvance}
          onConfirm={handleConfirm}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputClassName={field.inputClassName}
        />
      );

    case "otp":
      return (
        <OtpField
          fieldKey={field.key}
          otpLength={field.otpLength}
          autoAdvance={field.autoAdvance ?? true}
          onRequest={field.onRequest}
          onVerify={field.onVerify}
          onConfirm={handleConfirm}
          onChange={handleChange}
          resendLabel={field.resendLabel}
          resendDelay={field.resendDelay}
          className={field.inputClassName}
        />
      );

    case "password":
      return (
        <PasswordField
          fieldKey={field.key}
          placeholder={field.placeholder}
          defaultValue={editValue}
          suffix={field.suffix}
          onConfirm={handleConfirm}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputClassName={field.inputClassName}
        />
      );

    case "date":
      return (
        <DateField
          fieldKey={field.key}
          placeholder={field.placeholder}
          defaultValue={editValue}
          suffix={field.suffix}
          onConfirm={handleConfirm}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputClassName={field.inputClassName}
        />
      );

    // text, tel, email, number — all use InlineInput with the appropriate type
    default:
      return (
        <InlineInput
          fieldKey={field.key}
          type={field.type}
          placeholder={field.placeholder}
          defaultValue={editValue}
          suffix={field.suffix}
          sanitise={field.sanitise}
          onConfirm={handleConfirm}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputClassName={field.inputClassName}
        />
      );
  }
}

/**
 * Renders a single sentence row — the core building block of the narrative form.
 *
 * Lifecycle:
 * 1. `typing` — Prose types out the prefix text
 * 2. `active` — Input appears for the user to fill
 * 3. `confirmed` — Value is locked, shown as filled text with edit icon
 * 4. `editing` — User clicked edit, input re-appears with current value
 *
 * Validation runs on confirm. If it fails, the field stays active and
 * an error message is displayed below the input.
 *
 * @param props - Line configuration
 */
export const Line: React.FC<LineProps> = React.memo(function Line({
  field,
  status,
  value,
  allValues = {},
  typewriter,
  editable = true,
  locked = false,
  editLabel = "Edit",
  onTypingComplete,
  onConfirm,
  onEdit,
  onError,
  onChange,
  onFocus,
  onBlur,
}) {
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [asyncState, setAsyncState] = useState<AsyncState>("idle");
  const abortRef = useRef<(() => void) | null>(null);
  const { showToast } = useToast();

  const isFieldEditable = field.editable !== false && editable && !locked;
  const shouldAnimate = field.animate !== false && (typewriter?.enabled !== false);

  const handleTypingComplete = useCallback(() => {
    onTypingComplete(field.key);
  }, [field.key, onTypingComplete]);

  const handleConfirm = useCallback(
    (val: string) => {
      // Abort any in-flight async validation
      abortRef.current?.();
      abortRef.current = null;

      // Run sync validation first
      const result = validateField(val, field.validation, allValues);

      if (!result.valid) {
        const firstError = result.errors[0] ?? "Validation failed";
        setError(firstError);
        setAsyncState("idle");
        onError?.(field.key, firstError);

        const display = field.validation?.errorDisplay;
        const mode = display?.mode ?? "inline";

        if (mode === "shake" || mode === "inline+shake") {
          setShake(false);
          setTimeout(() => setShake(true), 10);
        }

        if (mode === "toast") {
          showToast(firstError, display?.icon, display?.iconChar);
        }

        return; // Block confirmation
      }

      // Check if async validation is needed
      if (hasAsyncValidation(field.validation)) {
        setAsyncState("validating");
        setError(null);

        const handle = validateFieldAsync(val, field.validation, allValues);
        abortRef.current = handle.abort;

        handle.promise
          .then((asyncResult) => {
            if (!asyncResult.valid) {
              const firstError = asyncResult.errors[0] ?? "Validation failed";
              setError(firstError);
              setAsyncState("invalid");
              onError?.(field.key, firstError);
            } else {
              setAsyncState("valid");
              setError(null);
              // Short delay to show success before confirming
              setTimeout(() => {
                setAsyncState("idle");
                onConfirm(field.key, val);
              }, 300);
            }
          })
          .catch(() => {
            // Aborted or unexpected error — reset silently
            setAsyncState("idle");
          });

        return; // Don't confirm yet — wait for async
      }

      // Sync validation passed, no async — confirm
      setError(null);
      setShake(false);
      setAsyncState("idle");
      onConfirm(field.key, val);
    },
    [field.key, field.validation, allValues, onConfirm, onError, showToast],
  );

  const handleEdit = useCallback(() => {
    setError(null);
    setShake(false);
    setAsyncState("idle");
    abortRef.current?.();
    onEdit(field.key);
  }, [field.key, onEdit]);

  const handleChange = useCallback(
    (val: string) => {
      const clearOn = field.validation?.errorDisplay?.clearOn ?? "onChange";
      if (clearOn === "onChange" && error !== null) {
        setError(null);
        setShake(false);
        setAsyncState("idle");
      }
      onChange?.(field.key, val);
    },
    [field.key, onChange, error, field.validation?.errorDisplay?.clearOn],
  );

  const handleFocus = useCallback(() => {
    const clearOn = field.validation?.errorDisplay?.clearOn ?? "onChange";
    if (clearOn === "onFocus" && error !== null) {
      setError(null);
      setShake(false);
      setAsyncState("idle");
    }
    onFocus?.(field.key);
  }, [field.key, onFocus, error, field.validation?.errorDisplay?.clearOn]);

  const handleBlur = useCallback(
    (val: string) => {
      onBlur?.(field.key, val);
    },
    [field.key, onBlur],
  );

  // Build CSS class list
  const lineClasses = [
    "ns-line",
    `ns-line-${field.key}`,
    status === "active" || status === "editing" ? "ns-line--active" : undefined,
    status === "confirmed" ? "ns-line--confirmed" : undefined,
    status === "editing" ? "ns-line--editing" : undefined,
    error !== null ? "ns-line--error" : undefined,
    shake ? "ns-line--shake" : undefined,
    field.className,
  ]
    .filter(Boolean)
    .join(" ");

  // Determine what to show based on status
  const showInput = status === "active" || status === "editing";
  const showFilled = status === "confirmed";

  return (
    <div className={lineClasses} role="group" aria-label={field.prefix}>
      <Prose
        text={field.prefix}
        animate={status === "typing" && shouldAnimate}
        speed={typewriter?.speed}
        cursor={typewriter?.cursor}
        cursorChar={typewriter?.cursorChar}
        pauseAfter={typewriter?.pauseAfter}
        onComplete={status === "typing" ? handleTypingComplete : undefined}
      />

      {/* Show input when field is active or being edited */}
      {showInput && renderFieldInput({
        field,
        status,
        value,
        handleConfirm,
        handleChange,
        handleFocus,
        handleBlur,
      })}

      {/* Async validation indicators */}
      {showInput && asyncState === "validating" && (
        <span className="ns-loading-indicator" aria-label="Validating" />
      )}
      {showInput && asyncState === "valid" && (
        <span className="ns-success-indicator" aria-label="Valid">✓</span>
      )}

      {/* Show filled value when confirmed */}
      {showFilled && (
        <FilledValue
          value={String(value ?? "")}
          suffix={field.suffix}
          editable={isFieldEditable}
          onEdit={handleEdit}
          editLabel={editLabel}
        />
      )}

      {/* Show validation error */}
      {error !== null && showInput && (
        <ErrorMessage
          message={error}
          display={field.validation?.errorDisplay}
        />
      )}
    </div>
  );
});
