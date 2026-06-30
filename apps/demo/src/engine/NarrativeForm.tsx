import { useEffect, useRef, useState } from "react";
import { useTypewriter } from "./useTypewriter";
import { validateField } from "./validate";
import type { NarrativeField } from "./types";
import "./narrative-form.css";

interface NarrativeFormProps {
  fields: NarrativeField[];
  welcomeHeading?: string;
  welcomeSubtext?: string;
  doneMessage?: (values: Record<string, string>) => string;
  doneCtaLabel?: string;
  onComplete?: (values: Record<string, string>) => void;
  compact?: boolean;
  speed?: number;
}

function EditIcon({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="ns-edit-btn" title="Edit" type="button">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
}

function Cursor() {
  return <span className="ns-cursor">|</span>;
}

export default function NarrativeForm({
  fields,
  welcomeHeading = "Welcome!",
  welcomeSubtext = "Before we begin, let's get to know you.",
  doneMessage,
  doneCtaLabel = "Continue →",
  onComplete,
  compact = false,
  speed = 32,
}: NarrativeFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [visibleCount, setVisibleCount] = useState(1);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const visibleFields = fields.slice(0, visibleCount);
  const lastIdx = visibleCount - 1;

  const reset = () => {
    setValues({});
    setConfirmed({});
    setEditing({});
    setErrors({});
    setVisibleCount(1);
    setDone(false);
  };

  // reset when field config changes (switching presets)
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [visibleCount, done]);

  const confirm = (field: NarrativeField, idx: number) => {
    const raw = values[field.key] || "";
    const value = field.sanitise ? field.sanitise(raw) : raw;
    const err = validateField(value, field.validation, values);
    if (err) {
      setErrors((e) => ({ ...e, [field.key]: err }));
      return;
    }
    setErrors((e) => ({ ...e, [field.key]: null }));
    setValues((v) => ({ ...v, [field.key]: value }));
    setConfirmed((c) => ({ ...c, [field.key]: true }));
    setEditing((ed) => ({ ...ed, [field.key]: false }));

    if (idx === fields.length - 1) {
      setTimeout(() => setDone(true), 250);
    } else if (idx === visibleCount - 1) {
      setTimeout(() => setVisibleCount((n) => n + 1), 200);
    }
  };

  const startEdit = (key: string) => {
    setEditing((e) => ({ ...e, [key]: true }));
    setConfirmed((c) => ({ ...c, [key]: false }));
    setDone(false);
  };

  return (
    <div className={`ns-root${compact ? " ns-root--compact" : ""}`}>
      <div className="ns-letter">
        {welcomeHeading && (
          <div className="ns-welcome">
            <p className="ns-welcome-text">{welcomeSubtext}</p>
          </div>
        )}

        {visibleFields.map((field, idx) => (
          <Line
            key={field.key}
            field={field}
            idx={idx}
            isLast={idx === lastIdx}
            value={values[field.key] || ""}
            confirmed={!!confirmed[field.key]}
            editing={!!editing[field.key]}
            error={errors[field.key]}
            allValues={values}
            speed={speed}
            inputRef={(el) => (inputRefs.current[field.key] = el)}
            onChange={(v) => {
              setValues((vals) => ({ ...vals, [field.key]: v }));
              if (errors[field.key]) setErrors((e) => ({ ...e, [field.key]: null }));
            }}
            onConfirm={() => confirm(field, idx)}
            onEdit={() => startEdit(field.key)}
          />
        ))}

        {done && (
          <div className="ns-done">
            <div className="ns-divider" />
            <p className="ns-done-text">
              {doneMessage ? doneMessage(values) : `That's all we need, ${values[fields[0]?.key] || ""}.`}
            </p>
            <div className="ns-done-actions">
              <button
                className="ns-cta"
                type="button"
                onClick={() => onComplete?.(values)}
              >
                {doneCtaLabel}
              </button>
              <button className="ns-reset" type="button" onClick={reset}>
                Start over
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function Line({
  field,
  value,
  confirmed,
  editing,
  error,
  speed,
  inputRef,
  onChange,
  onConfirm,
  onEdit,
}: {
  field: NarrativeField;
  idx: number;
  isLast: boolean;
  value: string;
  confirmed: boolean;
  editing: boolean;
  error?: string | null;
  allValues: Record<string, string>;
  speed: number;
  inputRef: (el: HTMLInputElement | null) => void;
  onChange: (v: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  const tw = useTypewriter(field.prefix, true, speed);
  const active = !confirmed || editing;
  const localRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (tw.done && active) {
      setTimeout(() => localRef.current?.focus(), 60);
    }
  }, [tw.done, active]);

  const canConfirm = field.type === "chips" ? !!value : value.trim().length > 0;

  return (
    <div className={`ns-line ns-line-${field.key}${confirmed ? " ns-line--confirmed" : ""}`}>
      <span className="ns-prose">
        {tw.displayed}
        {!tw.done && <Cursor />}
      </span>
      {tw.done && (
        <>
          <span className="ns-prose">&nbsp;</span>
          {active ? (
            field.type === "chips" ? (
              <span className="ns-chips-wrap">
                {field.options?.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    className={`ns-chip${value === opt ? " ns-chip--active" : ""}`}
                    onClick={() => {
                      onChange(opt);
                      setTimeout(onConfirm, 80);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </span>
            ) : (
              <span className="ns-input-wrap">
                <input
                  ref={(el) => {
                    localRef.current = el;
                    inputRef(el);
                  }}
                  className={`ns-input${error ? " ns-input--error" : ""}`}
                  type={field.type === "password" ? "password" : field.type === "number" ? "number" : "text"}
                  inputMode={field.type === "tel" ? "numeric" : undefined}
                  style={{ minWidth: Math.max(value.length * 16, field.placeholder ? field.placeholder.length * 11 : 100) + "px" }}
                  value={value}
                  placeholder={field.placeholder}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canConfirm && onConfirm()}
                  spellCheck={false}
                />
                {canConfirm && (
                  <button type="button" className="ns-enter-btn" onClick={onConfirm}>
                    ↵
                  </button>
                )}
              </span>
            )
          ) : (
            <span className="ns-filled-wrap">
              <span className="ns-filled-value">{value}</span>
              <EditIcon onClick={onEdit} />
            </span>
          )}
          {active && field.type !== "chips" && <span className="ns-prose">{field.suffix ? "" : "."}</span>}
        </>
      )}
      {error && tw.done && active && <div className="ns-error-text">{error}</div>}
    </div>
  );
}
