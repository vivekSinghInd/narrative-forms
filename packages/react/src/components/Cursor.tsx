/**
 * Blinking cursor component for the typewriter effect.
 *
 * @remarks
 * Renders a single character that blinks via CSS animation.
 * Visible only while the typewriter is actively typing.
 * CSS class: `ns-cursor`
 */

import React from "react";

/** Props for the Cursor component. */
export interface CursorProps {
  /** The character to display as the cursor. Default: "|" */
  cursorChar?: string;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * A blinking cursor character displayed during typewriter animation.
 *
 * @param props - Cursor configuration
 */
export const Cursor: React.FC<CursorProps> = React.memo(function Cursor({
  cursorChar = "|",
  className,
}) {
  const classes = ["ns-cursor", className].filter(Boolean).join(" ");
  return <span className={classes} aria-hidden="true">{cursorChar}</span>;
});
