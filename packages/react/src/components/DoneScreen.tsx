/**
 * DoneScreen — the completion screen shown after all fields are confirmed.
 *
 * @remarks
 * Displays a personalised message (with template variable interpolation)
 * and a submit CTA button. Supports `{key}` placeholders in the message
 * string that are replaced with confirmed field values.
 *
 * Also supports a function-mode message: `(values) => string`.
 *
 * CSS classes: `ns-done`, `ns-done-message`, `ns-done-cta`,
 * `ns-done-cta--loading`, `ns-done-cta--success`, `ns-done-cta--error`,
 * `ns-done-error`
 */

import React, { useCallback, useState } from "react";
import type {
  NarrativeDone,
  NarrativeFieldValues,
  NarrativeMeta,
  NarrativeTypewriter,
} from "@viveksinghind/narrative-form-core";
import { Prose } from "./Prose";

/** Possible states for the submit CTA button. */
type SubmitState = "default" | "loading" | "success" | "error";

/** Props for the DoneScreen component. */
export interface DoneScreenProps {
  /** Done screen configuration. */
  done: NarrativeDone;
  /** All confirmed field values. */
  values: NarrativeFieldValues;
  /** Analytics metadata. */
  meta: NarrativeMeta;
  /** Typewriter settings for the message animation. */
  typewriter?: NarrativeTypewriter;
  /** Additional CSS class for the wrapper. */
  className?: string;
}

/**
 * Interpolates `{key}` template variables in a string with values.
 *
 * @param template - String with `{key}` placeholders
 * @param values - Map of field key → confirmed value
 * @returns Interpolated string
 */
function interpolateMessage(
  template: string,
  values: NarrativeFieldValues,
): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const val = values[key];
    if (Array.isArray(val)) return val.join(", ");
    return typeof val === "string" ? val : `{${key}}`;
  });
}

/**
 * Renders the done screen with a personalised message and submit button.
 *
 * @param props - Done screen configuration
 */
export const DoneScreen: React.FC<DoneScreenProps> = React.memo(
  function DoneScreen({ done, values, meta, typewriter, className }) {
    const [submitState, setSubmitState] = useState<SubmitState>("default");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const ctaLabel = done.ctaLabel ?? "Continue \u2192";
    const shouldAnimate = typewriter?.enabled !== false;

    // Resolve the message — function or template string
    const resolvedMessage = (() => {
      if (typeof done.message === "function") {
        return done.message(values);
      }
      if (typeof done.message === "string") {
        return interpolateMessage(done.message, values);
      }
      return "You\u2019re all set!";
    })();

    const handleSubmit = useCallback(async () => {
      if (!done.onSubmit || submitState === "loading" || submitState === "success") {
        return;
      }

      setSubmitState("loading");
      setErrorMessage(null);

      try {
        await done.onSubmit(values, meta);
        setSubmitState("success");
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setErrorMessage(msg);
        setSubmitState("error");
      }
    }, [done, values, meta, submitState]);

    const wrapperClasses = ["ns-done", className].filter(Boolean).join(" ");

    const ctaClasses = [
      "ns-done-cta",
      submitState === "loading" ? "ns-done-cta--loading" : undefined,
      submitState === "success" ? "ns-done-cta--success" : undefined,
      submitState === "error" ? "ns-done-cta--error" : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    // Determine button label based on state
    const buttonLabel = (() => {
      switch (submitState) {
        case "loading":
          return "Please wait\u2026";
        case "success":
          return "\u2713 Done";
        case "error":
          return "Try again";
        default:
          return ctaLabel;
      }
    })();

    return (
      <div className={wrapperClasses}>
        <div className="ns-done-message">
          <Prose
            text={resolvedMessage}
            animate={shouldAnimate}
            speed={typewriter?.speed}
            cursor={typewriter?.cursor}
            cursorChar={typewriter?.cursorChar}
          />
        </div>

        {done.onSubmit && (
          <button
            type="button"
            className={ctaClasses}
            onClick={handleSubmit}
            disabled={submitState === "loading" || submitState === "success"}
          >
            {submitState === "loading" && (
              <span className="ns-loading-indicator" aria-hidden="true" />
            )}
            {buttonLabel}
          </button>
        )}

        {errorMessage !== null && (
          <p className="ns-done-error">{errorMessage}</p>
        )}
      </div>
    );
  },
);
