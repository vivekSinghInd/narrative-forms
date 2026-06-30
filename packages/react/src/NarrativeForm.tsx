/**
 * NarrativeForm — root component for narrative-form.
 *
 * @remarks
 * Main entry point for consumers. Renders fields one by one with typewriter
 * animations and manages the full lifecycle: welcome → fields → done.
 *
 * Supports: theming, dark mode, welcome/done screens, async validation,
 * dynamic forms (fieldsUrl/formConfig), controlled mode, default values,
 * field dependencies (showIf), step locking (lockPrevious), i18n/RTL,
 * and cross-field validation.
 *
 * CSS classes: `ns-root`, `ns-letter`, `ns-root--complete`,
 * `ns-root--dark`, `ns-root--submitting`, `ns-root--loading`, `ns-root--error`
 */

import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import type {
  NarrativeField,
  NarrativeTheme,
  NarrativeTypewriter,
  NarrativeWelcome,
  NarrativeDone,
  NarrativeCallbacks,
  NarrativeFieldValues,
  NarrativeMeta,
  NarrativeRefHandle,
  NarrativeI18n,
  NarrativeFormConfig,
  NarrativeCrossFieldValidator,
} from "@viveksinghind/narrative-form-core";
import { mergeStrings } from "@viveksinghind/narrative-form-core";
import { useFormState } from "./hooks/useFormState";
import { useDynamicForm } from "./hooks/useDynamicForm";
import { Line } from "./components/Line";
import { ToastProvider } from "./components/ToastProvider";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { DoneScreen } from "./components/DoneScreen";

/** Props for the NarrativeForm component. */
export interface NarrativeFormProps {
  /** Ordered list of field configurations (static mode). */
  fields?: NarrativeField[];
  /** URL to fetch form config from (dynamic mode). */
  fieldsUrl?: string;
  /** Headers for the fieldsUrl fetch request. */
  fieldsUrlHeaders?: Record<string, string>;
  /** Pre-fetched form config object (dynamic mode). */
  formConfig?: NarrativeFormConfig;
  /** Theme configuration — colours, typography, spacing. */
  theme?: NarrativeTheme;
  /** Typewriter animation settings. */
  typewriter?: NarrativeTypewriter;
  /** Welcome screen configuration. Pass `{ show: false }` to skip. */
  welcome?: NarrativeWelcome;
  /** Done screen configuration. Pass `{ show: false }` to skip. */
  done?: NarrativeDone;
  /** Whether confirmed fields show an edit icon. Default: true */
  editable?: boolean;
  /** Label for the edit button. Default: "Edit" */
  editLabel?: string;
  /** Additional CSS class added to the root element. */
  className?: string;
  /** Event callbacks for analytics and integration. */
  callbacks?: NarrativeCallbacks;
  /** Ref handle for imperative API (next, getValues, reset, focusField). */
  formRef?: React.Ref<NarrativeRefHandle>;
  /** Default values — pre-fill fields as already confirmed. */
  defaultValues?: NarrativeFieldValues;
  /** Controlled mode — external values source of truth. */
  values?: NarrativeFieldValues;
  /** i18n string overrides. */
  strings?: Partial<NarrativeI18n>;
  /** BCP 47 locale code. */
  locale?: string;
  /** Text direction. Auto-detected from locale if not set. */
  direction?: "ltr" | "rtl";
  /** Cross-field validation rules. */
  crossFieldValidators?: NarrativeCrossFieldValidator[];
  /** Custom loading component while fetching dynamic config. */
  loadingComponent?: React.ReactNode;
  /** Custom error component when config fetch fails. */
  errorComponent?: React.ReactNode;
  /** Callback when config fetch fails. */
  onFetchError?: (error: Error) => void;
  /** Label for the retry button on fetch error. */
  retryLabel?: string;
  /** Whether reduced motion should be forced. */
  reducedMotion?: boolean;
  /** Layout style: line-by-line (default) or continuous paragraph. */
  layout?: "lines" | "paragraph";
}



/**
 * Inner form component that uses theme context.
 */
const NarrativeFormInner: React.FC<NarrativeFormProps> = function NarrativeFormInner({
  fields: staticFields,
  fieldsUrl,
  fieldsUrlHeaders,
  formConfig,
  typewriter,
  welcome: welcomeProp,
  done: doneProp,
  editable = true,
  editLabel,
  className,
  callbacks,
  formRef,
  defaultValues,
  values: controlledValues,
  strings: stringsProp,
  locale,
  direction: directionProp,
  crossFieldValidators,
  loadingComponent,
  errorComponent,
  onFetchError,
  retryLabel,
  reducedMotion,
  layout = "lines",
}) {
  const { isDark } = useTheme();
  const i18n = useMemo(() => mergeStrings(stringsProp), [stringsProp]);

  // Resolve text direction
  const direction = useMemo(() => {
    if (directionProp) return directionProp;
    if (locale) {
      const rtlLocales = ["ar", "he", "fa", "ur"];
      const lang = locale.split("-")[0]?.toLowerCase();
      if (lang && rtlLocales.includes(lang)) return "rtl" as const;
    }
    return "ltr" as const;
  }, [directionProp, locale]);

  // Dynamic form fetching
  const { config: dynamicConfig, loading: dynamicLoading, error: dynamicError, retry } =
    useDynamicForm({ fieldsUrl, fieldsUrlHeaders: fieldsUrlHeaders, onFetchError });

  // Resolve fields from static, formConfig, or dynamic
  const resolvedConfig = useMemo(() => {
    if (staticFields) return { fields: staticFields };
    if (formConfig) return formConfig;
    if (dynamicConfig) return dynamicConfig;
    return null;
  }, [staticFields, formConfig, dynamicConfig]);

  const fields = resolvedConfig?.fields ?? [];
  const welcome = welcomeProp ?? (resolvedConfig && "welcome" in resolvedConfig
    ? (resolvedConfig as NarrativeFormConfig).welcome
    : undefined);
  const done = doneProp ?? (resolvedConfig && "done" in resolvedConfig
    ? (resolvedConfig as NarrativeFormConfig).done
    : undefined);

  // Effective typewriter config (respect reducedMotion)
  const effectiveTypewriter = useMemo<NarrativeTypewriter>(() => ({
    ...typewriter,
    enabled: reducedMotion ? false : (typewriter?.enabled ?? true),
  }), [typewriter, reducedMotion]);

  const {
    snapshot,
    startTyping,
    activateField,
    confirmField,
    editField,
    reconfirmField,
    next,
    focusField,
    reset,
    getValues,
    getMeta,
  } = useFormState(fields);

  // Welcome screen state
  const showWelcome = welcome?.show !== false && welcome !== undefined;
  const [welcomeDismissed, setWelcomeDismissed] = useState(!showWelcome);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track if the first field has been started
  const hasStartedRef = useRef(false);

  // Apply default values on mount
  const defaultsAppliedRef = useRef(false);
  useEffect(() => {
    if (defaultsAppliedRef.current || !defaultValues) return;
    defaultsAppliedRef.current = true;

    for (const field of fields) {
      const val = defaultValues[field.key];
      if (val !== undefined) {
        startTyping(field.key);
        activateField(field.key);
        confirmField(field.key, val);
      }
    }
  }, [defaultValues, fields, startTyping, activateField, confirmField]);

  // Start typing the first non-confirmed field after welcome is dismissed
  useEffect(() => {
    if (!welcomeDismissed) return;
    if (hasStartedRef.current) return;
    if (fields.length === 0) return;

    hasStartedRef.current = true;

    // Find the first non-confirmed field
    const firstField = fields.find((f) => snapshot.statuses[f.key] !== "confirmed");
    if (firstField) {
      startTyping(firstField.key);
    }
  }, [welcomeDismissed, fields, startTyping, snapshot.statuses]);

  // Expose ref API
  useEffect(() => {
    if (!formRef) return;

    const handle: NarrativeRefHandle = {
      next,
      getValues,
      reset: () => {
        setWelcomeDismissed(!showWelcome);
        hasStartedRef.current = false;
        defaultsAppliedRef.current = false;
        reset();
      },
      focusField,
    };

    if (typeof formRef === "function") {
      formRef(handle);
    } else if (formRef && "current" in formRef) {
      (formRef as React.MutableRefObject<NarrativeRefHandle | null>).current = handle;
    }
  }, [formRef, next, getValues, reset, focusField, showWelcome]);

  // ── Callbacks ──────────────────────────────────────────────────

  const handleWelcomeStart = useCallback(() => {
    setWelcomeDismissed(true);
  }, []);

  const handleTypingComplete = useCallback(
    (key: string) => {
      activateField(key);
    },
    [activateField],
  );

  const handleConfirm = useCallback(
    (key: string, value: string) => {
      const status = snapshot.statuses[key];

      // Use controlled values if provided
      const finalValue = controlledValues?.[key] !== undefined
        ? String(controlledValues[key])
        : value;

      if (status === "editing") {
        reconfirmField(key, finalValue);
      } else {
        confirmField(key, finalValue);
      }

      // Fire callbacks
      callbacks?.onFieldComplete?.(key, finalValue, 0);

      // Check if all visible fields are confirmed after this one
      const updatedValues = { ...snapshot.values, [key]: finalValue };
      const visibleFieldKeys = fields
        .filter((f) => {
          if (!f.showIf) return true;
          return f.showIf(updatedValues);
        })
        .map((f) => f.key);

      const allConfirmed = visibleFieldKeys.every(
        (k) => k === key || snapshot.statuses[k] === "confirmed",
      );

      if (allConfirmed) {
        // Filter out hidden field values
        const finalValues: NarrativeFieldValues = {};
        for (const k of visibleFieldKeys) {
          const v = k === key ? finalValue : snapshot.values[k];
          if (v !== undefined) finalValues[k] = v;
        }
        callbacks?.onComplete?.(finalValues, getMeta());
      } else {
        // Start typing the next unconfirmed visible field
        const currentIndex = fields.findIndex((f) => f.key === key);
        for (let i = currentIndex + 1; i < fields.length; i++) {
          const nextField = fields[i];
          if (!nextField) continue;
          if (snapshot.statuses[nextField.key] === "confirmed") continue;

          // Check showIf
          const nextUpdatedValues = { ...snapshot.values, [key]: finalValue };
          if (nextField.showIf && !nextField.showIf(nextUpdatedValues)) continue;

          startTyping(nextField.key);
          break;
        }
      }
    },
    [snapshot, fields, confirmField, reconfirmField, startTyping, callbacks, getMeta, controlledValues],
  );

  const handleEdit = useCallback(
    (key: string) => {
      editField(key);
      callbacks?.onEdit?.(key);
    },
    [editField, callbacks],
  );

  const handleError = useCallback(
    (key: string, message: string) => {
      callbacks?.onError?.(key, message);
    },
    [callbacks],
  );

  const handleChange = useCallback(
    (key: string, value: string) => {
      callbacks?.onChange?.(key, value);
    },
    [callbacks],
  );

  const handleFocus = useCallback(
    (key: string) => {
      callbacks?.onFieldFocus?.(key);
    },
    [callbacks],
  );

  const handleBlur = useCallback(
    (key: string, value: string) => {
      callbacks?.onFieldBlur?.(key, value);
    },
    [callbacks],
  );

  // ── Drop-off tracking ─────────────────────────────────────────
  useEffect(() => {
    const onDropOff = callbacks?.onDropOff;
    if (!onDropOff) return;
    if (typeof window === "undefined") return;

    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && !snapshot.isComplete) {
        const activeField = fields.find(
          (f) => snapshot.statuses[f.key] === "active" || snapshot.statuses[f.key] === "editing",
        );
        if (activeField) {
          onDropOff(activeField.key);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [callbacks, snapshot, fields]);

  // ── Determine visible fields ──────────────────────────────────
  const visibleFields = useMemo(() => {
    return fields.filter((field) => {
      const status = snapshot.statuses[field.key];
      const isStarted = status === "typing" || status === "active" ||
        status === "confirmed" || status === "editing";
      if (!isStarted) return false;

      // Evaluate showIf
      if (field.showIf && !field.showIf(snapshot.values)) return false;

      return true;
    });
  }, [fields, snapshot.statuses, snapshot.values]);

  // Determine which fields are locked
  const lockedFields = useMemo(() => {
    const locked = new Set<string>();

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (!field) continue;
      if (
        field.lockPrevious &&
        (snapshot.statuses[field.key] === "active" ||
          snapshot.statuses[field.key] === "typing" ||
          snapshot.statuses[field.key] === "editing" ||
          snapshot.statuses[field.key] === "confirmed")
      ) {
        // Lock all previous fields
        for (let j = 0; j < i; j++) {
          const prev = fields[j];
          if (prev) locked.add(prev.key);
        }
      }
    }

    return locked;
  }, [fields, snapshot.statuses]);

  // Done screen visibility
  const showDone = done?.show !== false && done !== undefined && snapshot.isComplete;

  // Dynamic form loading/error states
  if (fieldsUrl && dynamicLoading) {
    return (
      <div className="ns-root">
        {loadingComponent ?? <div className="ns-loading-indicator" aria-label="Loading form" />}
      </div>
    );
  }

  if (fieldsUrl && dynamicError) {
    return (
      <div className="ns-root">
        {errorComponent ?? (
          <div className="ns-done">
            <p className="ns-error-text">{i18n.fetchErrorMessage}</p>
            <button type="button" className="ns-done-cta" onClick={retry}>
              {retryLabel ?? i18n.retryLabel}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Build root CSS classes
  const rootClasses = [
    "ns-root",
    snapshot.isComplete ? "ns-root--complete" : undefined,
    isDark ? "ns-root--dark" : undefined,
    isSubmitting ? "ns-root--submitting" : undefined,
    layout === "paragraph" ? "ns-layout-paragraph" : "ns-layout-lines",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClasses} dir={direction} lang={locale}>
      {/* Welcome screen */}
      {!welcomeDismissed && welcome && (
        <WelcomeScreen
          welcome={welcome}
          typewriter={effectiveTypewriter}
          onStart={handleWelcomeStart}
        />
      )}

      {/* Form body — only visible after welcome is dismissed */}
      {welcomeDismissed && (
        <div className="ns-letter" role="form" aria-label="Narrative form">
          {visibleFields.map((field) => (
            <Line
              key={field.key}
              field={field}
              status={snapshot.statuses[field.key] ?? "idle"}
              value={controlledValues?.[field.key] ?? snapshot.values[field.key]}
              allValues={snapshot.values}
              typewriter={effectiveTypewriter}
              editable={editable}
              locked={lockedFields.has(field.key)}
              editLabel={editLabel ?? i18n.editLabel}
              onTypingComplete={handleTypingComplete}
              onConfirm={handleConfirm}
              onEdit={handleEdit}
              onError={handleError}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          ))}
        </div>
      )}

      {/* Done screen */}
      {showDone && done && (
        <DoneScreen
          done={done}
          values={snapshot.values}
          meta={getMeta()}
          typewriter={effectiveTypewriter}
        />
      )}
    </div>
  );
};

/**
 * The root narrative-form component.
 *
 * Renders fields one by one with typewriter animations. Each field follows
 * the lifecycle: idle → typing → active → confirmed → editing.
 *
 * @param props - Form configuration
 */
export const NarrativeForm: React.FC<NarrativeFormProps> = function NarrativeForm(props) {
  return (
    <ThemeProvider theme={props.theme}>
      <ToastProvider>
        <NarrativeFormInner {...props} />
      </ToastProvider>
    </ThemeProvider>
  );
};
