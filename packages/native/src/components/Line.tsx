import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from "react-native";
import type { NarrativeField, FieldStatus, NarrativeTypewriter, NarrativeFieldValues } from "@viveksinghind/narrative-form-core";
import { validateField, validateFieldAsync, hasAsyncValidation } from "@viveksinghind/narrative-form-core";
import { ErrorMessage } from "./ErrorMessage";
import { useTheme } from "./ThemeProvider";

export interface LineProps {
  field: NarrativeField;
  status: FieldStatus;
  value: any;
  allValues: NarrativeFieldValues;
  typewriter: NarrativeTypewriter;
  editable: boolean;
  locked: boolean;
  editLabel: string;
  onTypingComplete: (key: string) => void;
  onConfirm: (key: string, value: string) => void;
  onEdit: (key: string) => void;
  onError: (key: string, error: string) => void;
  onChange: (key: string, value: string) => void;
  onFocus: (key: string) => void;
  onBlur: (key: string, value: string) => void;
}

export const Line: React.FC<LineProps> = ({
  field,
  status,
  value,
  allValues,
  typewriter,
  editable,
  locked,
  editLabel,
  onTypingComplete,
  onConfirm,
  onEdit,
  onError,
  onChange,
  onFocus,
  onBlur,
}) => {
  const { theme, isDark } = useTheme();
  
  const [typedPrompt, setTypedPrompt] = useState("");
  const [localValue, setLocalValue] = useState(value ? String(value) : "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  const inputRef = useRef<TextInput>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  useEffect(() => {
    if (value !== undefined && String(value) !== localValue) {
      setLocalValue(String(value));
    }
  }, [value]);

  useEffect(() => {
    if (status !== "typing") return;
    
    if (!typewriter.enabled) {
      setTypedPrompt(field.prefix);
      onTypingComplete(field.key);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setTypedPrompt(field.prefix.slice(0, i + 1));
      i++;
      if (i >= field.prefix.length) {
        clearInterval(interval);
        onTypingComplete(field.key);
      }
    }, typewriter.speed ?? 30);

    return () => clearInterval(interval);
  }, [status, field.prefix, field.key, typewriter, onTypingComplete]);

  useEffect(() => {
    if (status === "active" || status === "editing") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [status]);

  const handleConfirm = useCallback(async () => {
    const syncResult = validateField(localValue, field.validation, allValues);
    if (!syncResult.valid) {
      const err = syncResult.errors[0] || "Invalid input";
      setErrorMsg(err);
      onError(field.key, err);
      return;
    }

    if (hasAsyncValidation(field.validation)) {
      setIsValidating(true);
      const asyncResult = await validateFieldAsync(localValue, field.validation, allValues).promise;
      setIsValidating(false);
      
      if (!asyncResult.valid) {
        const err = asyncResult.errors[0] || "Invalid input";
        setErrorMsg(err);
        onError(field.key, err);
        return;
      }
    }

    setErrorMsg(null);
    Keyboard.dismiss();
    onConfirm(field.key, localValue);
  }, [field, localValue, allValues, onError, onConfirm]);

  const textColor = theme?.textColor || (isDark ? "#fff" : "#000");
  const primaryColor = theme?.buttonBackground || "#007bff";

  const isConfirmed = status === "confirmed";
  const isActive = status === "active" || status === "editing";

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.promptRow}>
        <Text style={[styles.prompt, { color: textColor }]}>
          {status === "typing" ? typedPrompt : field.prefix}
        </Text>
        
        {isConfirmed && (
          <Text style={[styles.value, { color: primaryColor }]}>{localValue}</Text>
        )}
        
        {isConfirmed && editable && !locked && (
          <TouchableOpacity onPress={() => onEdit(field.key)} style={styles.editBtn}>
            <Text style={[styles.editBtnText, { color: primaryColor }]}>{editLabel}</Text>
          </TouchableOpacity>
        )}
      </View>

      {isActive && (
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              { color: textColor, borderBottomColor: isValidating ? "#ccc" : primaryColor }
            ]}
            value={localValue}
            onChangeText={(text: string) => {
              setLocalValue(text);
              onChange(field.key, text);
              if (errorMsg) setErrorMsg(null);
            }}
            onFocus={() => onFocus(field.key)}
            onBlur={() => onBlur(field.key, localValue)}
            onSubmitEditing={handleConfirm}
            keyboardType={field.type === "email" ? "email-address" : "default"}
            secureTextEntry={field.type === "password"}
            returnKeyType="next"
            editable={!isValidating}
          />
        </View>
      )}
      
      <ErrorMessage message={errorMsg} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  promptRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  prompt: {
    fontSize: 18,
    marginRight: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  editBtn: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  inputRow: {
    marginTop: 8,
  },
  input: {
    fontSize: 18,
    paddingVertical: 8,
    borderBottomWidth: 2,
  }
});
