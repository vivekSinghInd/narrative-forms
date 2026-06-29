/**
 * ThemeProvider — applies NarrativeTheme tokens as CSS custom properties.
 *
 * @remarks
 * Converts theme token names (e.g., `background`, `textColor`) into CSS
 * variable names (e.g., `--ns-bg`, `--ns-text`) and applies them as inline
 * style on a wrapper element. This avoids any CSS-in-JS dependency.
 *
 * Supports dark mode via `theme.mode` (`'light'`, `'dark'`, `'auto'`).
 * When `'auto'`, it uses `matchMedia('(prefers-color-scheme: dark)')`.
 *
 * CSS classes: none (uses ns-root--dark on root via className)
 */

import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import type { NarrativeTheme } from "@viveksinghind/narrative-form-core";

/** Resolved theme context value. */
export interface ThemeContextValue {
  /** The resolved theme tokens (merged with dark overrides if applicable). */
  theme: NarrativeTheme;
  /** Whether dark mode is currently active. */
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: {},
  isDark: false,
});

/**
 * Hook to access the current theme context.
 *
 * @returns The resolved theme and dark mode state
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/**
 * Maps NarrativeTheme token names to CSS variable names.
 * Only tokens with a non-undefined value are included.
 */
const TOKEN_TO_CSS_VAR: Record<string, string> = {
  background: "--ns-bg",
  textColor: "--ns-text",
  inputBorderColor: "--ns-border",
  placeholderColor: "--ns-placeholder-color",
  errorColor: "--ns-error",
  filledColor: "--ns-filled-color",
  cursorColor: "--ns-cursor-color",
  successColor: "--ns-success-color",
  loadingColor: "--ns-loading-color",
  fontFamily: "--ns-font-family",
  uiFontFamily: "--ns-ui-font",
  fontSize: "--ns-font-size",
  mobileFontSize: "--ns-mobile-font-size",
  inputFontStyle: "--ns-input-font-style",
  lineGap: "--ns-line-gap",
  pagePadding: "--ns-page-padding",
  buttonRadius: "--ns-btn-radius",
  buttonBackground: "--ns-btn-bg",
  buttonColor: "--ns-btn-color",
  enterBtnSize: "--ns-enter-size",
  chipBorderRadius: "--ns-chip-radius",
  chipBorderColor: "--ns-chip-border",
  chipActiveBackground: "--ns-chip-active-bg",
  chipActiveColor: "--ns-chip-active-color",
  chipFontStyle: "--ns-chip-font-style",
};

/**
 * Convert a NarrativeTheme object into a CSS variables style object.
 *
 * @param theme - Theme tokens to convert
 * @returns A React CSSProperties object with CSS custom properties
 */
function themeToCssVars(theme: NarrativeTheme): React.CSSProperties {
  const style: Record<string, string> = {};

  for (const [tokenName, cssVar] of Object.entries(TOKEN_TO_CSS_VAR)) {
    const value = theme[tokenName as keyof NarrativeTheme];
    if (typeof value === "string" && value.length > 0) {
      style[cssVar] = value;
    }
  }

  return style as React.CSSProperties;
}

/**
 * Hook to detect system dark mode preference.
 *
 * @returns Whether the system prefers dark mode
 */
function usePrefersDark(): boolean {
  const [prefersDark, setPrefersDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent): void => {
      setPrefersDark(e.matches);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersDark;
}

/** Props for the ThemeProvider component. */
export interface ThemeProviderProps {
  /** The theme configuration. */
  theme?: NarrativeTheme;
  /** Children to render. */
  children: React.ReactNode;
}

/**
 * Provides theme context and applies CSS custom properties.
 *
 * @param props - Theme provider configuration
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = function ThemeProvider({
  theme = {},
  children,
}) {
  const systemPrefersDark = usePrefersDark();

  // Determine if dark mode is active
  const isDark = useMemo(() => {
    if (theme.mode === "dark") return true;
    if (theme.mode === "auto") return systemPrefersDark;
    return false;
  }, [theme.mode, systemPrefersDark]);

  // Merge dark overrides if dark mode is active
  const resolvedTheme = useMemo(() => {
    if (isDark && theme.dark) {
      return { ...theme, ...theme.dark };
    }
    return theme;
  }, [theme, isDark]);

  // Convert theme tokens to CSS variables
  const cssVars = useMemo(() => themeToCssVars(resolvedTheme), [resolvedTheme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({ theme: resolvedTheme, isDark }),
    [resolvedTheme, isDark],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {/*
       * CSS variables are set here so they cascade into all ns- elements.
       * The ns-root--dark class toggles the dark colour palette from base.css.
       * This div is invisible — it only carries CSS variables.
       */}
      <div style={cssVars} className={isDark ? "ns-root--dark" : undefined}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
