import React, { createContext, useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export interface ToastContextValue {
  showToast: (message: string, type?: "error" | "success" | "info") => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

  const showToast = useCallback((message: string, type: "error" | "success" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <View style={styles.container}>
        {children}
        {toast && (
          <View style={[styles.toast, toast.type === "error" ? styles.toastError : styles.toastSuccess]}>
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        )}
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toast: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#333",
    alignItems: "center",
  },
  toastError: {
    backgroundColor: "#d32f2f",
  },
  toastSuccess: {
    backgroundColor: "#2e7d32",
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
  },
});
