import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import type { NarrativeDone, NarrativeFieldValues, NarrativeMeta, NarrativeTypewriter } from "@viveksinghind/narrative-form-core";
import { useTheme } from "./ThemeProvider";

export interface DoneScreenProps {
  done: NarrativeDone;
  values: NarrativeFieldValues;
  meta: NarrativeMeta;
  typewriter: NarrativeTypewriter;
}

export const DoneScreen: React.FC<DoneScreenProps> = ({ done, values, meta }) => {
  const { theme, isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const textColor = theme?.textColor || (isDark ? "#fff" : "#000");

  const messageStr = typeof done.message === "function" ? done.message(values) : done.message;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={[styles.title, { color: textColor }]}>{messageStr}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  }
});
