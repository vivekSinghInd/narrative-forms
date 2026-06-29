/**
 * ChipsField — tap to select one option for narrative-form.
 *
 * @remarks
 * Renders a row of pill-shaped chips. User taps one to select it.
 * Supports optional auto-advance, keyboard navigation (Arrow keys + Space),
 * and RTL layout.
 * CSS classes: `ns-chips-wrap`, `ns-chip`, `ns-chip--active`, `ns-chip--hover`
 */

import React, { useState, useCallback, useRef } from "react";

/** Props for the ChipsField component. */
export interface ChipsFieldProps {
  /** Unique field key. */
  fieldKey: string;
  /** Array of option labels. */
  options: string[];
  /** Currently selected value (for edit mode). */
  defaultValue?: string;
  /** Whether to auto-confirm on selection. Default: false */
  autoAdvance?: boolean;
  /** Callback when a value is confirmed. */
  onConfirm: (value: string) => void;
  /** Callback on selection change. */
  onChange?: (value: string) => void;
  /** Additional CSS class for the wrapper. */
  className?: string;
}

/**
 * A single-select chip field rendered inline within a sentence.
 * Supports Arrow Left/Right keyboard navigation and Space to select.
 *
 * @param props - ChipsField configuration
 */
export const ChipsField: React.FC<ChipsFieldProps> = function ChipsField({
  fieldKey,
  options,
  defaultValue,
  autoAdvance = false,
  onConfirm,
  onChange,
  className,
}) {
  const [selected, setSelected] = useState<string | null>(defaultValue ?? null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const chipsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = useCallback(
    (option: string) => {
      setSelected(option);
      onChange?.(option);

      if (autoAdvance) {
        onConfirm(option);
      }
    },
    [autoAdvance, onConfirm, onChange],
  );

  const handleConfirm = useCallback(() => {
    if (selected !== null) {
      onConfirm(selected);
    }
  }, [selected, onConfirm]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      switch (e.key) {
        case "Enter":
        case " ": {
          e.preventDefault();
          const option = options[index];
          if (option) handleSelect(option);
          break;
        }
        case "ArrowRight":
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex = (index + 1) % options.length;
          setFocusedIndex(nextIndex);
          chipsRef.current[nextIndex]?.focus();
          break;
        }
        case "ArrowLeft":
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex = (index - 1 + options.length) % options.length;
          setFocusedIndex(prevIndex);
          chipsRef.current[prevIndex]?.focus();
          break;
        }
      }
    },
    [handleSelect, options],
  );

  const wrapClasses = ["ns-chips-wrap", className].filter(Boolean).join(" ");

  return (
    <span className={wrapClasses} role="listbox" aria-label={fieldKey}>
      {options.map((option, index) => {
        const chipClasses = [
          "ns-chip",
          selected === option ? "ns-chip--active" : undefined,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={option}
            ref={(el) => { chipsRef.current[index] = el; }}
            type="button"
            className={chipClasses}
            onClick={() => handleSelect(option)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-selected={selected === option}
            role="option"
            tabIndex={index === focusedIndex ? 0 : -1}
          >
            {option}
          </button>
        );
      })}
      {!autoAdvance && selected !== null && (
        <button
          type="button"
          className="ns-enter-btn"
          onClick={handleConfirm}
          aria-label="Confirm"
          style={{ opacity: 1, transform: "none" }}
        >
          ↵
        </button>
      )}
    </span>
  );
};
