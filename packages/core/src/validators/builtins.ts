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

  // ── Global & Regional validators ────────────────────────────────

  /** International E.164 phone number format (e.g. +14155552671). */
  registerValidator("e164Phone", (value) => {
    const cleaned = value.replace(/[\s\-\(\)]/g, "");
    return /^\+[1-9]\d{6,14}$/.test(cleaned) || "Enter a valid international phone number starting with + and country code";
  });

  /** International Bank Account Number (IBAN) standard check. */
  registerValidator("iban", (value) => {
    const cleaned = value.replace(/[\s\-]/g, "").toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(cleaned)) {
      return "Enter a valid IBAN number";
    }
    return true;
  });

  /** Credit Card number check using Luhn Algorithm. */
  registerValidator("creditCard", (value) => {
    const cleaned = value.replace(/[\s\-]/g, "");
    if (!/^\d{13,19}$/.test(cleaned)) {
      return "Enter a valid credit card number";
    }
    let sum = 0;
    let shouldDouble = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0 || "Enter a valid credit card number";
  });

  /** US ZIP code (5 digits or ZIP+4: 12345 or 12345-6789). */
  registerValidator("usZipCode", (value) => {
    return /^\d{5}(-\d{4})?$/.test(value.trim()) || "Enter a valid 5-digit or 9-digit US ZIP code";
  });

  /** US Social Security Number (XXX-XX-XXXX). */
  registerValidator("usSsn", (value) => {
    const cleaned = value.trim();
    return /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/.test(cleaned) ||
      "Enter a valid US SSN in XXX-XX-XXXX format";
  });

  /** UK Postcode format. */
  registerValidator("ukPostcode", (value) => {
    const cleaned = value.trim().toUpperCase();
    return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/.test(cleaned) || "Enter a valid UK postcode";
  });

  /** Domain name format (e.g. example.com). */
  registerValidator("domain", (value) => {
    return /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(value.trim()) ||
      "Enter a valid domain name (e.g. example.com)";
  });

  /** IP Address (IPv4 or IPv6). */
  registerValidator("ipAddress", (value) => {
    const trimmed = value.trim();
    const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6 = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
    return ipv4.test(trimmed) || ipv6.test(trimmed) || "Enter a valid IPv4 or IPv6 address";
  });

  /** Standard UUID format (e.g. 123e4567-e89b-12d3-a456-426614174000). */
  registerValidator("uuid", (value) => {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value.trim()) ||
      "Enter a valid UUID";
  });

  /** URL-friendly slug or username (letters, numbers, hyphens, underscores). */
  registerValidator("slug", (value) => {
    return /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/i.test(value.trim()) ||
      "Only lowercase letters, numbers, hyphens, and underscores allowed";
  });

  /** Hex color code (e.g. #FFF or #3B82F6). */
  registerValidator("hexColor", (value) => {
    return /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(value.trim()) ||
      "Enter a valid HEX color code (e.g. #3B82F6)";
  });

  /** MAC Address format (e.g. 00:1B:44:11:3A:B7 or 00-1B-44-11-3A-B7). */
  registerValidator("macAddress", (value) => {
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value.trim()) ||
      "Enter a valid MAC address";
  });
}
