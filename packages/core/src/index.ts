// narrative-form-core
// Framework-agnostic core logic
// Author: Vivek Singh

export * from "./types";
export { FormStateEngine } from "./state/formState";
export type { FieldStatus, FormStateSnapshot } from "./state/formState";
export { validateField, validateFieldAsync, hasAsyncValidation } from "./validation/engine";
export type { ValidationResult, AsyncValidationHandle } from "./validation/engine";
export {
  registerValidator,
  getValidator,
  hasValidator,
  unregisterValidator,
  clearValidators,
  getRegisteredValidatorNames,
} from "./validators/registry";
export type { ValidatorFn } from "./validators/registry";
export { registerBuiltinValidators } from "./validators/builtins";
export { defaultStrings, mergeStrings } from "./i18n/strings";
export { fetchFormConfig, ConfigFetchError } from "./dynamic/fetchConfig";
export type { FetchConfigOptions } from "./dynamic/fetchConfig";
