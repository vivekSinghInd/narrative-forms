import React, { useEffect, useRef, useState } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { NarrativeWelcome, NarrativeTypewriter } from "@viveksinghind/narrative-form-core";
import { useTheme } from "./ThemeProvider";

export interface WelcomeScreenProps {
  welcome: NarrativeWelcome;
  typewriter: NarrativeTypewriter;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ welcome, typewriter, onStart }) => {
  const { theme, isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const [typedTitle, setTypedTitle] = useState("");
  
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  useEffect(() => {
    if (!typewriter.enabled) {
      setTypedTitle(welcome.heading || "");
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setTypedTitle((welcome.heading || "").slice(0, i + 1));
      i++;
      if (i >= (welcome.heading || "").length) {
        clearInterval(interval);
      }
    }, typewriter.speed ?? 30);

    return () => clearInterval(interval);
  }, [welcome.heading, typewriter]);

  const textColor = theme?.textColor || (isDark ? "#fff" : "#000");
  const primaryColor = theme?.buttonBackground || "#007bff";

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={[styles.title, { color: textColor }]}>{typedTitle}</Text>
      {welcome.subtext && (
        <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>{welcome.subtext}</Text>
      )}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: primaryColor }]} 
        onPress={onStart}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{welcome.ctaLabel || "Start"}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  }
});
