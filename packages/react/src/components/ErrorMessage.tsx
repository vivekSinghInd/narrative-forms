/**
 * ErrorMessage — validation error display for narrative-form.
 *
 * @remarks
 * Displays validation errors based on the configured mode (inline, tooltip).
 * Supports animations (fadeUp, slideDown, shake) and optional icons.
 *
 * CSS classes:
 * - `ns-error-wrap` (base)
 * - `ns-error-wrap--tooltip` / `ns-error-wrap--inline`
 * - `ns-error-wrap--above` / `ns-error-wrap--below`
 * - `ns-error-text`
 * - `ns-error-text--shake`
 * - `ns-animate-fade-up` / `ns-animate-slide-down`
 */

import React from "react";
import type { NarrativeErrorDisplay } from "@viveksinghind/narrative-form-core";

/** Props for the ErrorMessage component. */
export interface ErrorMessageProps {
  /** The error message to display. */
  message: string;
  /** Display configuration for the error. */
  display?: NarrativeErrorDisplay;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Renders a validation error message.
 *
 * @param props - Error message configuration
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = React.memo(function ErrorMessage({
  message,
  display = {},
  className,
}) {
  const mode = display.mode ?? "inline";
  
  // If mode is toast, the error is handled by ToastProvider, so we don't render it here
  // (unless it's 'inline+shake', which means we render inline AND the parent handles shake)
  if (mode === "toast" || mode === "shake") {
    return null; 
  }

  const position = display.position ?? "below";
  const animateIn = display.animateIn ?? "fadeUp";
  const showIcon = display.icon ?? false;
  const iconChar = display.iconChar ?? "⚠";
  const isTooltip = mode === "tooltip";
  const isInlineShake = mode === "inline+shake";

  const wrapClasses = [
    "ns-error-wrap",
    isTooltip ? "ns-error-wrap--tooltip" : "ns-error-wrap--inline",
    `ns-error-wrap--${position}`,
    animateIn === "fadeUp" ? "ns-animate-fade-up" : undefined,
    animateIn === "slideDown" ? "ns-animate-slide-down" : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const textClasses = [
    "ns-error-text",
    isInlineShake ? "ns-error-text--shake" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapClasses} role="alert" aria-live="assertive">
      <span className={textClasses}>
        {showIcon && <span className="ns-error-icon" aria-hidden="true">{iconChar} </span>}
        {message}
      </span>
    </div>
  );
});
