<script setup lang="ts">
import { computed, provide, ref, onMounted, onUnmounted } from "vue";
import type { NarrativeTheme } from "@viveksinghind/narrative-form-core";

const props = withDefaults(defineProps<{
  theme?: NarrativeTheme;
}>(), {
  theme: () => ({}),
});

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

const systemPrefersDark = ref(false);
let mql: MediaQueryList | null = null;
const mqlHandler = (e: MediaQueryListEvent) => {
  systemPrefersDark.value = e.matches;
};

onMounted(() => {
  if (typeof window !== "undefined") {
    mql = window.matchMedia("(prefers-color-scheme: dark)");
    systemPrefersDark.value = mql.matches;
    mql.addEventListener("change", mqlHandler);
  }
});

onUnmounted(() => {
  if (mql) {
    mql.removeEventListener("change", mqlHandler);
  }
});

const isDark = computed(() => {
  if (props.theme.mode === "dark") return true;
  if (props.theme.mode === "auto") return systemPrefersDark.value;
  return false;
});

const resolvedTheme = computed(() => {
  if (isDark.value && props.theme.dark) {
    return { ...props.theme, ...props.theme.dark };
  }
  return props.theme;
});

const cssVars = computed(() => {
  const style: Record<string, string> = {};
  for (const [tokenName, cssVar] of Object.entries(TOKEN_TO_CSS_VAR)) {
    const value = resolvedTheme.value[tokenName as keyof NarrativeTheme];
    if (typeof value === "string" && value.length > 0) {
      style[cssVar] = value;
    }
  }
  return style;
});

provide("themeContext", computed(() => ({
  theme: resolvedTheme.value,
  isDark: isDark.value,
})));
</script>

<template>
  <div :style="cssVars" :class="isDark ? 'ns-root--dark' : undefined">
    <slot />
  </div>
</template>
