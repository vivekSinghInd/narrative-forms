/**
 * Confirmed/filled value display component.
 *
 * @remarks
 * Renders the confirmed field value as styled italic text alongside
 * an edit icon. Shown after a field is confirmed.
 * CSS classes: `ns-filled-wrap`, `ns-filled-value`
 */

import React from "react";
import { EditIcon } from "./EditIcon";

/** Props for the FilledValue component. */
export interface FilledValueProps {
  /** The confirmed value to display. */
  value: string;
  /** Suffix text displayed after the value. */
  suffix?: string;
  /** Whether the edit icon should be shown. Default: true */
  editable?: boolean;
  /** Callback fired when the edit icon is clicked. */
  onEdit?: () => void;
  /** Label for the edit button. Default: "Edit" */
  editLabel?: string;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Displays a confirmed field value with an optional edit icon.
 *
 * @param props - FilledValue configuration
 */
export const FilledValue: React.FC<FilledValueProps> = React.memo(function FilledValue({
  value,
  suffix,
  editable = true,
  onEdit,
  editLabel = "Edit",
  className,
}) {
  const classes = ["ns-filled-wrap", className].filter(Boolean).join(" ");

  return (
    <span className={classes}>
      <span className="ns-filled-value">{value}</span>
      {suffix && <span className="ns-suffix">{suffix}</span>}
      {editable && onEdit && (
        <EditIcon onEdit={onEdit} label={editLabel} />
      )}
    </span>
  );
});
