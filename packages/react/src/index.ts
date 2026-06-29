// narrative-form-react
// React wrapper for narrative-form-core
// Author: Vivek Singh

import "./styles/base.css";

// ── Main component ──
export { NarrativeForm } from "./NarrativeForm";
export type { NarrativeFormProps } from "./NarrativeForm";

// ── Theme ──
export { ThemeProvider, useTheme } from "./components/ThemeProvider";
export type { ThemeProviderProps, ThemeContextValue } from "./components/ThemeProvider";

// ── Screens ──
export { WelcomeScreen } from "./components/WelcomeScreen";
export type { WelcomeScreenProps } from "./components/WelcomeScreen";
export { DoneScreen } from "./components/DoneScreen";
export type { DoneScreenProps } from "./components/DoneScreen";

// ── Hooks ──
export { useTypewriter } from "./hooks/useTypewriter";
export type { UseTypewriterOptions, UseTypewriterResult } from "./hooks/useTypewriter";
export { useFormState } from "./hooks/useFormState";
export type { UseFormStateResult } from "./hooks/useFormState";

// ── Components ──
export { Line } from "./components/Line";
export type { LineProps } from "./components/Line";
export { Prose } from "./components/Prose";
export type { ProseProps } from "./components/Prose";
export { Cursor } from "./components/Cursor";
export type { CursorProps } from "./components/Cursor";
export { InlineInput } from "./components/InlineInput";
export type { InlineInputProps } from "./components/InlineInput";
export { EnterButton } from "./components/EnterButton";
export type { EnterButtonProps } from "./components/EnterButton";
export { FilledValue } from "./components/FilledValue";
export type { FilledValueProps } from "./components/FilledValue";
export { EditIcon } from "./components/EditIcon";
export type { EditIconProps } from "./components/EditIcon";
export { ErrorMessage } from "./components/ErrorMessage";
export type { ErrorMessageProps } from "./components/ErrorMessage";

// ── Field Types ──
export { TextField } from "./components/fields/TextField";
export type { TextFieldProps } from "./components/fields/TextField";
export { TelField } from "./components/fields/TelField";
export type { TelFieldProps } from "./components/fields/TelField";
export { EmailField } from "./components/fields/EmailField";
export type { EmailFieldProps } from "./components/fields/EmailField";
export { PasswordField } from "./components/fields/PasswordField";
export type { PasswordFieldProps } from "./components/fields/PasswordField";
export { NumberField } from "./components/fields/NumberField";
export type { NumberFieldProps } from "./components/fields/NumberField";
export { ChipsField } from "./components/fields/ChipsField";
export type { ChipsFieldProps } from "./components/fields/ChipsField";
export { MultiChipsField } from "./components/fields/MultiChipsField";
export type { MultiChipsFieldProps } from "./components/fields/MultiChipsField";
export { SelectField } from "./components/fields/SelectField";
export type { SelectFieldProps } from "./components/fields/SelectField";
export { OtpField } from "./components/fields/OtpField";
export type { OtpFieldProps } from "./components/fields/OtpField";

// ── Re-export all core types ──
export type {
  NarrativeField,
  NarrativeFieldType,
  NarrativeValidation,
  NarrativeValidationRule,
  NarrativeServerValidation,
  NarrativeTheme,
  NarrativeTypewriter,
  NarrativeWelcome,
  NarrativeDone,
  NarrativeFormConfig,
  NarrativeCallbacks,
  NarrativeI18n,
  NarrativeRefHandle,
  NarrativeFieldValues,
  NarrativeMeta,
  NarrativeCrossFieldValidator,
  NarrativeErrorDisplay,
} from "@viveksinghind/narrative-form-core";

// ── Re-export core engine and utilities ──
export { FormStateEngine } from "@viveksinghind/narrative-form-core";
export type { FieldStatus, FormStateSnapshot } from "@viveksinghind/narrative-form-core";
export { validateField, validateFieldAsync, hasAsyncValidation } from "@viveksinghind/narrative-form-core";
export type { ValidationResult, AsyncValidationHandle } from "@viveksinghind/narrative-form-core";
export {
  registerValidator,
  getValidator,
  hasValidator,
  unregisterValidator,
  clearValidators,
  getRegisteredValidatorNames,
} from "@viveksinghind/narrative-form-core";
export type { ValidatorFn } from "@viveksinghind/narrative-form-core";
export { registerBuiltinValidators } from "@viveksinghind/narrative-form-core";
export { defaultStrings, mergeStrings } from "@viveksinghind/narrative-form-core";
