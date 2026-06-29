/**
 * Default internationalisation strings for narrative-form.
 *
 * @remarks
 * All user-facing copy lives here. Consumers override via the `i18n` prop,
 * which is deep-merged with these defaults using {@link mergeStrings}.
 */

import type { NarrativeI18n } from "../types";

/** Default English strings shipped with the package. */
export const defaultStrings: Readonly<Required<NarrativeI18n>> = {
  editLabel: "Edit",
  requiredMessage: "This field is required",
  otpResend: "Resend code",
  otpTimer: "Resend in {seconds}s",
  submitLabel: "Submit",
  loadingLabel: "Checking…",
  successLabel: "Looks good!",
  retryLabel: "Try again",
  fetchErrorMessage: "Something went wrong. Please try again.",
} as const;

/**
 * Deep-merge user-provided i18n overrides with the default strings.
 *
 * @param custom - Partial i18n overrides from the consumer
 * @returns A complete i18n object with all keys guaranteed to be present
 */
export function mergeStrings(custom?: Partial<NarrativeI18n>): Required<NarrativeI18n> {
  if (!custom) return { ...defaultStrings };
  return { ...defaultStrings, ...custom };
}
