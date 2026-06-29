import React, { createContext, useContext, useMemo } from "react";
import type { NarrativeTheme } from "@viveksinghind/narrative-form-core";

export interface ThemeContextValue {
  theme: NarrativeTheme | undefined;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: undefined,
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export interface ThemeProviderProps {
  theme?: NarrativeTheme;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  const value = useMemo(() => {
    // In React Native we can check Appearance.getColorScheme() if we want auto dark mode,
    // but for now we just rely on the theme prop.
    return {
      theme,
      isDark: !!theme?.mode && theme.mode === "dark",
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
