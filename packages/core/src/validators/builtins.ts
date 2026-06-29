/**
 * Built-in validators shipped with narrative-form.
 *
 * @remarks
 * These cover common Indian regulatory formats and universal patterns.
 * Call `registerBuiltinValidators()` once at app startup to register them all.
 *
 * **India-specific:** indianPhone, indianPincode, aadhaar, pan, gst, ifsc
 * **Universal:** email, url, strongPassword, alphanumeric, noSpaces,
 *                futureDate, pastDate, minAge
 *
 * @example
 * ```ts
 * import { registerBuiltinValidators } from "@viveksinghind/narrative-form-core";
 * registerBuiltinValidators(); // Call once at app startup
 * ```
 */

import { registerValidator, hasValidator } from "./registry";

/** Whether builtins have already been registered. */
let registered = false;

/**
 * Register all built-in validators.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export function registerBuiltinValidators(): void {
  if (registered) return;
  registered = true;

  // ── India-specific validators ──────────────────────────────────

  /** Indian phone number — starts with 6–9, exactly 10 digits. */
  registerValidator("indianPhone", (value) => {
    const cleaned = value.replace(/\s+/g, "");
    return /^[6-9]\d{9}$/.test(cleaned) || "Enter a valid 10-digit Indian phone number";
  });

  /** Indian pincode — exactly 6 digits. */
  registerValidator("indianPincode", (value) => {
    return /^\d{6}$/.test(value.trim()) || "Enter a valid 6-digit pincode";
  });

  /** Aadhaar number — exactly 12 digits. */
  registerValidator("aadhaar", (value) => {
    const cleaned = value.replace(/\s+/g, "");
    return /^\d{12}$/.test(cleaned) || "Enter a valid 12-digit Aadhaar number";
  });

  /** PAN card — format ABCDE1234F (5 letters, 4 digits, 1 letter). */
  registerValidator("pan", (value) => {
    return /^[A-Z]{5}\d{4}[A-Z]$/.test(value.trim().toUpperCase()) ||
      "Enter a valid PAN (e.g., ABCDE1234F)";
  });

  /** GST number — 15 characters: 2 digits, 10 chars PAN, 1 digit, 1 letter, 1 check. */
  registerValidator("gst", (value) => {
    return /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[A-Z\d][A-Z]$/.test(value.trim().toUpperCase()) ||
      "Enter a valid 15-character GST number";
  });

  /** Bank IFSC code — 4 letters, 0, 6 alphanumeric characters. */
  registerValidator("ifsc", (value) => {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim().toUpperCase()) ||
      "Enter a valid IFSC code (e.g., SBIN0001234)";
  });

  // ── Universal validators ───────────────────────────────────────

  /** Valid email address. */
  registerValidator("email", (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
      "Enter a valid email address";
  });

  /** Valid URL. */
  registerValidator("url", (value) => {
    try {
      new URL(value.trim());
      return true;
    } catch {
      return "Enter a valid URL";
    }
  });

  /** Strong password — min 8 chars, upper, lower, number, special character. */
  registerValidator("strongPassword", (value) => {
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(value)) return "Password must contain a lowercase letter";
    if (!/\d/.test(value)) return "Password must contain a number";
    if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain a special character";
    return true;
  });

  /** Alphanumeric only — letters and numbers, no spaces or special chars. */
  registerValidator("alphanumeric", (value) => {
    return /^[A-Za-z0-9]+$/.test(value) || "Only letters and numbers are allowed";
  });

  /** No spaces allowed. */
  registerValidator("noSpaces", (value) => {
    return !/\s/.test(value) || "Spaces are not allowed";
  });

  /** Date must be in the future. */
  registerValidator("futureDate", (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "Enter a valid date";
    return date > new Date() || "Date must be in the future";
  });

  /** Date must be in the past. */
  registerValidator("pastDate", (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "Enter a valid date";
    return date < new Date() || "Date must be in the past";
  });

  /**
   * Minimum age — checks for 18+ years.
   */
  registerValidator("minAge", (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "Enter a valid date";

    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    return actualAge >= 18 || "You must be at least 18 years old";
  });
}
