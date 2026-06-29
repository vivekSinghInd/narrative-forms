/**
 * EnterButton — the ↵ confirm button displayed next to inline inputs.
 *
 * @remarks
 * Triggers field confirmation when clicked.
 * CSS class: `ns-enter-btn`
 */

import React from "react";

/** Props for the EnterButton component. */
export interface EnterButtonProps {
  /** Callback fired when the button is clicked. */
  onConfirm: () => void;
  /** Button label. Default: "↵" */
  label?: string;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * A small inline button that confirms the current field value.
 *
 * @param props - Button configuration
 */
export const EnterButton: React.FC<EnterButtonProps> = React.memo(function EnterButton({
  onConfirm,
  label = "↵",
  className,
}) {
  const classes = ["ns-enter-btn", className].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onConfirm}
      aria-label="Confirm"
    >
      {label}
    </button>
  );
});
