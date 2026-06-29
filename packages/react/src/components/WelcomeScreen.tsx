/**
 * WelcomeScreen — the opening screen of the narrative form.
 *
 * @remarks
 * Displays a heading (with optional typewriter animation), supporting
 * subtext, and a call-to-action button. Shown before any form fields.
 *
 * CSS classes: `ns-welcome`, `ns-welcome-heading`, `ns-welcome-subtext`,
 * `ns-welcome-cta`
 */

import React, { useCallback } from "react";
import type { NarrativeWelcome, NarrativeTypewriter } from "@viveksinghind/narrative-form-core";
import { Prose } from "./Prose";

/** Props for the WelcomeScreen component. */
export interface WelcomeScreenProps {
  /** Welcome screen configuration. */
  welcome: NarrativeWelcome;
  /** Typewriter settings for the heading animation. */
  typewriter?: NarrativeTypewriter;
  /** Called when the CTA button is clicked to start the form. */
  onStart: () => void;
  /** Additional CSS class for the wrapper. */
  className?: string;
}

/**
 * Renders the welcome screen with an animated heading and CTA.
 *
 * @param props - Welcome screen configuration
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = React.memo(
  function WelcomeScreen({ welcome, typewriter, onStart, className }) {
    const heading = welcome.heading ?? "Welcome";
    const subtext = welcome.subtext;
    const ctaLabel = welcome.ctaLabel ?? "Let\u2019s go \u2192";
    const shouldAnimate = typewriter?.enabled !== false;

    const handleClick = useCallback(() => {
      onStart();
    }, [onStart]);

    const wrapperClasses = ["ns-welcome", className].filter(Boolean).join(" ");

    return (
      <div className={wrapperClasses}>
        <h1 className="ns-welcome-heading">
          <Prose
            text={heading}
            animate={shouldAnimate}
            speed={typewriter?.speed}
            cursor={typewriter?.cursor}
            cursorChar={typewriter?.cursorChar}
          />
        </h1>

        {subtext && (
          <p className="ns-welcome-subtext">{subtext}</p>
        )}

        <button
          type="button"
          className="ns-welcome-cta"
          onClick={handleClick}
        >
          {ctaLabel}
        </button>
      </div>
    );
  },
);
