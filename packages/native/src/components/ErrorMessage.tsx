import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import type { NarrativeErrorDisplay } from "@viveksinghind/narrative-form-core";
import { useTheme } from "./ThemeProvider";

export interface ErrorMessageProps {
  message: string | null;
  config?: NarrativeErrorDisplay;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, config }) => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    if (message) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      opacity.setValue(0);
      translateY.setValue(-10);
    }
  }, [message, opacity, translateY]);

  if (!message) return null;

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Text style={[styles.errorText, { color: theme?.errorColor || "#d32f2f" }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  }
});
