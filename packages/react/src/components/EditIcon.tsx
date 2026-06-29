/**
 * Pencil edit icon button for confirmed fields.
 *
 * @remarks
 * Appears inline next to the filled value after a field is confirmed.
 * Clicking it reopens the field for editing.
 * CSS class: `ns-edit-btn`
 */

import React from "react";

/** Props for the EditIcon component. */
export interface EditIconProps {
  /** Callback fired when the edit icon is clicked. */
  onEdit: () => void;
  /** Accessible label for the button. Default: "Edit" */
  label?: string;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * A small pencil icon button that triggers field editing.
 *
 * @param props - Edit icon configuration
 */
export const EditIcon: React.FC<EditIconProps> = React.memo(function EditIcon({
  onEdit,
  label = "Edit",
  className,
}) {
  const classes = ["ns-edit-btn", className].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onEdit}
      aria-label={label}
      title={label}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
    </button>
  );
});
