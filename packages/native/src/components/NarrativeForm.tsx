import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
import { useFormState } from "../hooks/useFormState";
import { useDynamicForm } from "../hooks/useDynamicForm";
import { Line } from "./Line";
import { ToastProvider } from "./ToastProvider";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import { WelcomeScreen } from "./WelcomeScreen";
import { DoneScreen } from "./DoneScreen";

export interface NarrativeFormProps {
  fields?: NarrativeField[];
  fieldsUrl?: string;
  fieldsUrlHeaders?: Record<string, string>;
  formConfig?: NarrativeFormConfig;
  theme?: NarrativeTheme;
  typewriter?: NarrativeTypewriter;
  welcome?: NarrativeWelcome;
  done?: NarrativeDone;
  editable?: boolean;
  editLabel?: string;
  callbacks?: NarrativeCallbacks;
  formRef?: React.Ref<NarrativeRefHandle>;
  defaultValues?: NarrativeFieldValues;
  values?: NarrativeFieldValues;
  strings?: Partial<NarrativeI18n>;
  locale?: string;
  direction?: "ltr" | "rtl";
  crossFieldValidators?: NarrativeCrossFieldValidator[];
  reducedMotion?: boolean;
}

const NarrativeFormInner: React.FC<NarrativeFormProps> = (props) => {
  const { isDark } = useTheme();
  const i18n = useMemo(() => mergeStrings(props.strings), [props.strings]);

  const { config: dynamicConfig, loading, error, retry } =
    useDynamicForm({ fieldsUrl: props.fieldsUrl, fieldsUrlHeaders: props.fieldsUrlHeaders });

  const resolvedConfig = useMemo(() => {
    if (props.fields) return { fields: props.fields };
    if (props.formConfig) return props.formConfig;
    if (dynamicConfig) return dynamicConfig;
    return null;
  }, [props.fields, props.formConfig, dynamicConfig]);

  const fields = resolvedConfig?.fields ?? [];
  const welcome = props.welcome ?? (resolvedConfig && "welcome" in resolvedConfig ? (resolvedConfig as any).welcome : undefined);
  const done = props.done ?? (resolvedConfig && "done" in resolvedConfig ? (resolvedConfig as any).done : undefined);

  const effectiveTypewriter = useMemo<NarrativeTypewriter>(() => ({
    ...props.typewriter,
    enabled: props.reducedMotion ? false : (props.typewriter?.enabled ?? true),
  }), [props.typewriter, props.reducedMotion]);

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

  const showWelcome = welcome?.show !== false && welcome !== undefined;
  const [welcomeDismissed, setWelcomeDismissed] = useState(!showWelcome);
  
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!welcomeDismissed || hasStartedRef.current || fields.length === 0) return;
    hasStartedRef.current = true;
    const firstField = fields.find((f) => snapshot.statuses[f.key] !== "confirmed");
    if (firstField) {
      startTyping(firstField.key);
    }
  }, [welcomeDismissed, fields, startTyping, snapshot.statuses]);

  const handleConfirm = useCallback((key: string, value: string) => {
    const status = snapshot.statuses[key];
    if (status === "editing") {
      reconfirmField(key, value);
    } else {
      confirmField(key, value);
    }
    props.callbacks?.onFieldComplete?.(key, value, 0);

    const currentIndex = fields.findIndex((f) => f.key === key);
    for (let i = currentIndex + 1; i < fields.length; i++) {
      const nextField = fields[i];
      if (!nextField || snapshot.statuses[nextField.key] === "confirmed") continue;
      startTyping(nextField.key);
      break;
    }
  }, [snapshot, fields, confirmField, reconfirmField, startTyping, props.callbacks]);

  const visibleFields = useMemo(() => {
    return fields.filter((field) => {
      const status = snapshot.statuses[field.key];
      return status === "typing" || status === "active" || status === "confirmed" || status === "editing";
    });
  }, [fields, snapshot.statuses]);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visibleFields.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [visibleFields.length]);

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {!welcomeDismissed && welcome && (
        <WelcomeScreen
          welcome={welcome}
          typewriter={effectiveTypewriter}
          onStart={() => setWelcomeDismissed(true)}
        />
      )}

      {welcomeDismissed && (
        <View style={styles.formBody}>
          {visibleFields.map((field) => (
            <Line
              key={field.key}
              field={field}
              status={snapshot.statuses[field.key] ?? "idle"}
              value={props.values?.[field.key] ?? snapshot.values[field.key]}
              allValues={snapshot.values}
              typewriter={effectiveTypewriter}
              editable={props.editable ?? true}
              locked={false}
              editLabel={props.editLabel ?? i18n.editLabel}
              onTypingComplete={(k) => activateField(k)}
              onConfirm={handleConfirm}
              onEdit={(k) => {
                editField(k);
                props.callbacks?.onEdit?.(k);
              }}
              onError={(k, err) => props.callbacks?.onError?.(k, err)}
              onChange={(k, v) => props.callbacks?.onChange?.(k, v)}
              onFocus={(k) => props.callbacks?.onFieldFocus?.(k)}
              onBlur={(k, v) => props.callbacks?.onFieldBlur?.(k, v)}
            />
          ))}
        </View>
      )}

      {snapshot.isComplete && done && (
        <DoneScreen
          done={done}
          values={snapshot.values}
          meta={getMeta()}
          typewriter={effectiveTypewriter}
        />
      )}
    </ScrollView>
  );
};

export const NarrativeForm: React.FC<NarrativeFormProps> = (props) => {
  return (
    <ThemeProvider theme={props.theme}>
      <ToastProvider>
        <NarrativeFormInner {...props} />
      </ToastProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: "#ffffff",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  formBody: {
    flex: 1,
  }
});
