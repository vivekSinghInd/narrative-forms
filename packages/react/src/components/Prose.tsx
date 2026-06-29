/**
 * Typewriter prose text component.
 *
 * @remarks
 * Wraps the `useTypewriter` hook to render the sentence prefix
 * (e.g., "My name is") character by character, followed by a blinking cursor.
 * CSS classes: `ns-prose`, `ns-prose--typing`
 */

import React from "react";
import { useTypewriter } from "../hooks/useTypewriter";
import { Cursor } from "./Cursor";

/** Props for the Prose component. */
export interface ProseProps {
  /** The full sentence text to type out. */
  text: string;
  /** Whether typewriter animation is enabled. Default: true */
  animate?: boolean;
  /** Milliseconds per character. Default: 38 */
  speed?: number;
  /** Whether to show a blinking cursor while typing. Default: true */
  cursor?: boolean;
  /** Custom cursor character. Default: "|" */
  cursorChar?: string;
  /** Milliseconds to pause after typing before input appears. Default: 100 */
  pauseAfter?: number;
  /** Callback fired when typing is fully complete. */
  onComplete?: () => void;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Renders a sentence prefix with a typewriter animation.
 *
 * @param props - Prose configuration
 */
export const Prose: React.FC<ProseProps> = React.memo(function Prose({
  text,
  animate = true,
  speed = 38,
  cursor = true,
  cursorChar = "|",
  pauseAfter = 100,
  onComplete,
  className,
}) {
  const { displayedText, isTyping, isComplete } = useTypewriter({
    text,
    speed,
    enabled: animate,
    pauseAfter,
    onComplete,
  });

  const classes = [
    "ns-prose",
    isTyping ? "ns-prose--typing" : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {displayedText}
      {cursor && isTyping && <Cursor cursorChar={cursorChar} />}
    </span>
  );
});
