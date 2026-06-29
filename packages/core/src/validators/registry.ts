/**
 * Validator plugin registry for narrative-form.
 *
 * @remarks
 * Allows developers to register reusable named validators globally at app level.
 * Fields can then reference them by name via the `use` property.
 *
 * @example
 * ```ts
 * registerValidator("indianPhone", (value) => {
 *   return /^[6-9]\d{9}$/.test(value) || "Enter a valid Indian phone number";
 * });
 *
 * // In field config:
 * { key: "phone", type: "tel", prefix: "My phone is", validation: { use: "indianPhone" } }
 * ```
 */

import type { NarrativeFieldValues } from "../types";

/** A validator function that returns true on pass or an error string on fail. */
export type ValidatorFn = (
  value: string,
  allValues: NarrativeFieldValues,
) => boolean | string | Promise<boolean | string>;

/** Internal registry map of named validators. */
const registry = new Map<string, ValidatorFn>();

/**
 * Register a reusable named validator.
 *
 * @param name - Unique validator name (e.g., "indianPhone", "pan")
 * @param fn - Validator function returning true on pass or error string on fail
 */
export function registerValidator(name: string, fn: ValidatorFn): void {
  registry.set(name, fn);
}

/**
 * Retrieve a registered validator by name.
 *
 * @param name - The validator name to look up
 * @returns The validator function, or undefined if not found
 */
export function getValidator(name: string): ValidatorFn | undefined {
  return registry.get(name);
}

/**
 * Check if a validator is registered.
 *
 * @param name - The validator name to check
 */
export function hasValidator(name: string): boolean {
  return registry.has(name);
}

/**
 * Remove a registered validator.
 *
 * @param name - The validator name to remove
 */
export function unregisterValidator(name: string): void {
  registry.delete(name);
}

/**
 * Clear all registered validators.
 * Useful for testing or hot-reload scenarios.
 */
export function clearValidators(): void {
  registry.clear();
}

/**
 * Get all registered validator names.
 * Useful for debugging.
 */
export function getRegisteredValidatorNames(): string[] {
  return Array.from(registry.keys());
}
