/**
 * MultiChipsField — tap to select multiple options for narrative-form.
 *
 * @remarks
 * Renders a row of pill-shaped chips. User can tap multiple to select them.
 * Confirmed value is an array of selected option strings.
 * CSS classes: `ns-chips-wrap`, `ns-chip`, `ns-chip--active`, `ns-chip--hover`
 */

import React, { useState, useCallback } from "react";

/** Props for the MultiChipsField component. */
export interface MultiChipsFieldProps {
  /** Unique field key. */
  fieldKey: string;
  /** Array of option labels. */
  options: string[];
  /** Currently selected values (for edit mode). */
  defaultValue?: string[];
  /** Callback when values are confirmed. Receives comma-separated string. */
  onConfirm: (value: string) => void;
  /** Callback on selection change. */
  onChange?: (value: string) => void;
  /** Additional CSS class for the wrapper. */
  className?: string;
}

/**
 * A multi-select chip field rendered inline within a sentence.
 *
 * @param props - MultiChipsField configuration
 */
export const MultiChipsField: React.FC<MultiChipsFieldProps> = function MultiChipsField({
  fieldKey,
  options,
  defaultValue,
  onConfirm,
  onChange,
  className,
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(defaultValue ?? []),
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleToggle = useCallback(
    (option: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(option)) {
          next.delete(option);
        } else {
          next.add(option);
        }
        const value = Array.from(next).join(", ");
        onChange?.(value);
        return next;
      });
    },
    [onChange],
  );

  const handleConfirm = useCallback(() => {
    if (selected.size > 0) {
      onConfirm(Array.from(selected).join(", "));
    }
  }, [selected, onConfirm]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, option: string) => {
      if (e.key === "Enter" && selected.size > 0) {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === " ") {
        e.preventDefault();
        handleToggle(option);
      }
    },
    [handleToggle, handleConfirm, selected.size],
  );

  const wrapClasses = ["ns-chips-wrap", className].filter(Boolean).join(" ");

  return (
    <span className={wrapClasses}>
      {options.map((option, index) => {
        const isSelected = selected.has(option);
        const chipClasses = [
          "ns-chip",
          isSelected ? "ns-chip--active" : undefined,
          hoveredIndex === index ? "ns-chip--hover" : undefined,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={option}
            type="button"
            className={chipClasses}
            onClick={() => handleToggle(option)}
            onKeyDown={(e) => handleKeyDown(e, option)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            aria-pressed={isSelected}
            role="option"
          >
            {option}
          </button>
        );
      })}
      {selected.size > 0 && (
        <button
          type="button"
          className="ns-enter-btn"
          onClick={handleConfirm}
          aria-label="Confirm"
        >
          ↵
        </button>
      )}
    </span>
  );
};
