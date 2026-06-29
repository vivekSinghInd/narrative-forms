/**
 * Validation engine for narrative-form.
 *
 * @remarks
 * Runs validation rules in a strict priority order defined in SPEC.md.
 * Supports both `bail` (stop at first failure) and `all` (collect all errors) modes.
 *
 * **Priority order:**
 * 1. required
 * 2. minLength / maxLength
 * 3. exactLength
 * 4. min / max
 * 5. pattern / isEmail
 * 6. use (registered plugin validators) — in array order
 * 7. Sync custom rules — in array order
 * 8. Async custom rules — in array order
 * 9. serverValidate URL call
 * 10. Global cross-field validators (handled externally)
 *
 * Async rules only run if all sync rules pass first.
 */

import type {
  NarrativeValidation,
  NarrativeFieldValues,
  NarrativeServerValidation,
} from "../types";
import { getValidator } from "../validators/registry";

/** Result of running the validation engine on a single field. */
export interface ValidationResult {
  /** Whether the field value is valid. */
  valid: boolean;
  /** Array of error messages (empty if valid). */
  errors: string[];
}

/** Result of async validation — extends sync with an abort handle. */
export interface AsyncValidationHandle {
  /** Promise that resolves with the validation result. */
  promise: Promise<ValidationResult>;
  /** Abort the in-flight async validation. */
  abort: () => void;
}

/**
 * Validate a single field value synchronously.
 *
 * Runs rules in strict priority order. In `bail` mode (default),
 * stops at the first failure. In `all` mode, collects every error.
 *
 * @param value - The field value to validate
 * @param validation - The validation configuration for this field
 * @param allValues - All confirmed field values (for cross-field checks)
 * @returns Validation result with valid flag and error messages
 */
export function validateField(
  value: string,
  validation: NarrativeValidation | undefined,
  allValues: NarrativeFieldValues = {},
): ValidationResult {
  if (!validation) {
    return { valid: true, errors: [] };
  }

  const errors: string[] = [];
  const mode = validation.mode ?? "bail";

  /**
   * Add an error and return true if we should stop (bail mode).
   */
  const addError = (message: string): boolean => {
    errors.push(message);
    return mode === "bail";
  };

  // ── 1. required ──────────────────────────────────────────────────

  if (validation.required) {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      if (addError(validation.requiredMessage ?? "This field is required")) {
        return { valid: false, errors };
      }
    }
  }

  // Skip remaining rules if value is empty and not required
  if (value.trim().length === 0) {
    return { valid: errors.length === 0, errors };
  }

  // ── 2. minLength / maxLength ─────────────────────────────────────

  if (validation.minLength !== undefined && value.length < validation.minLength) {
    if (
      addError(
        validation.minLengthMessage ??
          `Must be at least ${String(validation.minLength)} characters`,
      )
    ) {
      return { valid: false, errors };
    }
  }

  if (validation.maxLength !== undefined && value.length > validation.maxLength) {
    if (
      addError(
        validation.maxLengthMessage ??
          `Must be at most ${String(validation.maxLength)} characters`,
      )
    ) {
      return { valid: false, errors };
    }
  }

  // ── 3. exactLength ───────────────────────────────────────────────

  if (validation.exactLength !== undefined && value.length !== validation.exactLength) {
    if (
      addError(
        validation.exactLengthMessage ??
          `Must be exactly ${String(validation.exactLength)} characters`,
      )
    ) {
      return { valid: false, errors };
    }
  }

  // ── 4. min / max (numeric) ───────────────────────────────────────

  if (validation.min !== undefined || validation.max !== undefined) {
    const num = Number(value);
    if (!isNaN(num)) {
      if (validation.min !== undefined && num < validation.min) {
        if (
          addError(
            validation.minMessage ?? `Must be at least ${String(validation.min)}`,
          )
        ) {
          return { valid: false, errors };
        }
      }

      if (validation.max !== undefined && num > validation.max) {
        if (
          addError(
            validation.maxMessage ?? `Must be at most ${String(validation.max)}`,
          )
        ) {
          return { valid: false, errors };
        }
      }
    }
  }

  // ── 5. pattern / isEmail ─────────────────────────────────────────

  if (validation.pattern !== undefined && !validation.pattern.test(value)) {
    if (addError(validation.patternMessage ?? "Invalid format")) {
      return { valid: false, errors };
    }
  }

  if (validation.isEmail) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value.trim())) {
      if (addError(validation.isEmailMessage ?? "Enter a valid email address")) {
        return { valid: false, errors };
      }
    }
  }

  // ── 6. use (registered plugin validators) — sync only ────────────

  if (validation.use !== undefined) {
    const names = Array.isArray(validation.use) ? validation.use : [validation.use];
    for (const name of names) {
      const validatorFn = getValidator(name);
      if (validatorFn) {
        const result = validatorFn(value, allValues);
        // Only handle sync results here — async handled in validateFieldAsync
        if (typeof result === "string") {
          if (addError(result)) {
            return { valid: false, errors };
          }
        } else if (result === false) {
          if (addError(`Validation "${name}" failed`)) {
            return { valid: false, errors };
          }
        }
        // If result is a Promise, skip it — handled by validateFieldAsync
      }
    }
  }

  // ── 7. Sync custom rules ─────────────────────────────────────────

  // Single custom validator function
  if (validation.custom !== undefined) {
    const result = validation.custom(value, allValues);
    // Only handle sync results here
    if (typeof result === "string") {
      if (addError(result)) {
        return { valid: false, errors };
      }
    } else if (result === false) {
      if (addError("Validation failed")) {
        return { valid: false, errors };
      }
    }
  }

  // Multiple named rules — sync only
  if (validation.rules !== undefined) {
    for (const rule of validation.rules) {
      if (rule.async) continue;

      const result = rule.validate(value, allValues);
      if (typeof result === "string") {
        if (addError(result)) {
          return { valid: false, errors };
        }
      } else if (result === false) {
        if (addError(rule.message ?? `Validation "${rule.name}" failed`)) {
          return { valid: false, errors };
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Check if a field has any async validation rules that need to run.
 *
 * @param validation - The validation configuration to check
 * @returns Whether async validation is needed
 */
export function hasAsyncValidation(
  validation: NarrativeValidation | undefined,
): boolean {
  if (!validation) return false;

  // Check for async custom rules
  if (validation.rules?.some((r) => r.async)) return true;

  // Check for server validation
  if (validation.serverValidate) return true;

  // Check if single custom validator returns a promise (can't know statically)
  // We'll handle this at runtime

  // Check if any `use` validators are async (can't know statically)
  // We'll handle this at runtime

  return false;
}

/**
 * Run async validation rules on a field value.
 *
 * Only runs if all sync rules pass first. Returns an abort handle
 * so callers can cancel in-flight requests on new input.
 *
 * @param value - The field value to validate
 * @param validation - The validation configuration
 * @param allValues - All confirmed field values
 * @returns An abort handle with a promise and abort method
 */
export function validateFieldAsync(
  value: string,
  validation: NarrativeValidation | undefined,
  allValues: NarrativeFieldValues = {},
): AsyncValidationHandle {
  const controller = new AbortController();

  const promise = (async (): Promise<ValidationResult> => {
    // First run all sync rules — if they fail, don't bother with async
    const syncResult = validateField(value, validation, allValues);
    if (!syncResult.valid) {
      return syncResult;
    }

    if (!validation) {
      return { valid: true, errors: [] };
    }

    const errors: string[] = [];
    const mode = validation.mode ?? "bail";

    const addError = (message: string): boolean => {
      errors.push(message);
      return mode === "bail";
    };

    // ── 8. Async custom rules ────────────────────────────────────

    // Single custom validator — might return a promise
    if (validation.custom !== undefined) {
      const result = validation.custom(value, allValues);
      if (result instanceof Promise) {
        if (controller.signal.aborted) return { valid: true, errors: [] };
        const resolved = await result;
        if (controller.signal.aborted) return { valid: true, errors: [] };
        if (typeof resolved === "string") {
          if (addError(resolved)) return { valid: false, errors };
        } else if (resolved === false) {
          if (addError("Validation failed")) return { valid: false, errors };
        }
      }
    }

    // Async use validators
    if (validation.use !== undefined) {
      const names = Array.isArray(validation.use) ? validation.use : [validation.use];
      for (const name of names) {
        const validatorFn = getValidator(name);
        if (validatorFn) {
          const result = validatorFn(value, allValues);
          if (result instanceof Promise) {
            if (controller.signal.aborted) return { valid: true, errors: [] };
            const resolved = await result;
            if (controller.signal.aborted) return { valid: true, errors: [] };
            if (typeof resolved === "string") {
              if (addError(resolved)) return { valid: false, errors };
            } else if (resolved === false) {
              if (addError(`Validation "${name}" failed`))
                return { valid: false, errors };
            }
          }
        }
      }
    }

    // Multiple named rules — async only
    if (validation.rules !== undefined) {
      for (const rule of validation.rules) {
        if (!rule.async) continue;
        if (controller.signal.aborted) return { valid: true, errors: [] };

        const result = await rule.validate(value, allValues);
        if (controller.signal.aborted) return { valid: true, errors: [] };

        if (typeof result === "string") {
          if (addError(result)) return { valid: false, errors };
        } else if (result === false) {
          if (addError(rule.message ?? `Validation "${rule.name}" failed`))
            return { valid: false, errors };
        }
      }
    }

    // ── 9. Server-driven validation ──────────────────────────────

    if (validation.serverValidate) {
      if (controller.signal.aborted) return { valid: true, errors: [] };

      const serverResult = await runServerValidation(
        value,
        validation.serverValidate,
        allValues,
        controller.signal,
      );

      if (controller.signal.aborted) return { valid: true, errors: [] };

      if (!serverResult.valid) {
        for (const err of serverResult.errors) {
          if (addError(err)) return { valid: false, errors };
        }
      }
    }

    return { valid: errors.length === 0, errors };
  })();

  return {
    promise,
    abort: () => controller.abort(),
  };
}

/**
 * Execute a server-driven validation call.
 *
 * @param value - The field value to validate
 * @param config - Server validation configuration
 * @param allValues - All confirmed values
 * @param signal - AbortSignal for cancellation
 * @returns Validation result from the server
 */
async function runServerValidation(
  value: string,
  config: NarrativeServerValidation,
  allValues: NarrativeFieldValues,
  signal: AbortSignal,
): Promise<ValidationResult> {
  const { url, method = "POST", headers = {}, timeout = 5000 } = config;

  try {
    const timeoutId = setTimeout(() => {
      // AbortController doesn't have timeout built-in on all targets
    }, timeout);

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal,
    };

    if (method === "POST") {
      fetchOptions.body = JSON.stringify({ value, allValues });
    }

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        valid: false,
        errors: [config.timeoutMessage ?? "Server validation failed"],
      };
    }

    const data: unknown = await response.json();

    // Extract pass/fail using responsePath
    const isValid = getNestedValue(data, config.responsePath);

    if (isValid === true || isValid === "true") {
      return { valid: true, errors: [] };
    }

    // Extract error message using errorPath
    const errorMsg = getNestedValue(data, config.errorPath);
    const message =
      typeof errorMsg === "string" && errorMsg.length > 0
        ? errorMsg
        : "Server validation failed";

    return { valid: false, errors: [message] };
  } catch (err: unknown) {
    if (signal.aborted) {
      return { valid: true, errors: [] };
    }
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Validation cancelled"
        : config.timeoutMessage ?? "Server validation failed";
    return { valid: false, errors: [message] };
  }
}

/**
 * Get a nested value from an object using a dot-separated path.
 *
 * @param obj - The object to traverse
 * @param path - Dot-separated path (e.g., "data.valid")
 * @returns The value at the path, or undefined
 */
function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}
