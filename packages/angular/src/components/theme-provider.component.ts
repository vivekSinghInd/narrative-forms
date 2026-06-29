import { Component, Input, OnInit, OnChanges, SimpleChanges, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NarrativeTheme } from '@viveksinghind/narrative-form-core';

const TOKEN_TO_CSS_VAR: Record<string, string> = {
  background: '--ns-bg',
  textColor: '--ns-text',
  inputBorderColor: '--ns-border',
  placeholderColor: '--ns-placeholder-color',
  errorColor: '--ns-error',
  filledColor: '--ns-filled-color',
  cursorColor: '--ns-cursor-color',
  successColor: '--ns-success-color',
  loadingColor: '--ns-loading-color',
  fontFamily: '--ns-font-family',
  uiFontFamily: '--ns-ui-font',
  fontSize: '--ns-font-size',
  mobileFontSize: '--ns-mobile-font-size',
  inputFontStyle: '--ns-input-font-style',
  lineGap: '--ns-line-gap',
  pagePadding: '--ns-page-padding',
  buttonRadius: '--ns-btn-radius',
  buttonBackground: '--ns-btn-bg',
  buttonColor: '--ns-btn-color',
  enterBtnSize: '--ns-enter-size',
  chipBorderRadius: '--ns-chip-radius',
  chipBorderColor: '--ns-chip-border',
  chipActiveBackground: '--ns-chip-active-bg',
  chipActiveColor: '--ns-chip-active-color',
  chipFontStyle: '--ns-chip-font-style',
};

@Component({
  selector: 'ns-theme-provider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngStyle]="cssVars" [ngClass]="isDark ? 'ns-root--dark' : ''">
      <ng-content></ng-content>
    </div>
  `,
})
export class NarrativeThemeProviderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() theme: NarrativeTheme = {};

  cssVars: Record<string, string> = {};
  isDark = false;
  systemPrefersDark = false;
  
  private mql: MediaQueryList | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.mql = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemPrefersDark = this.mql.matches;
      this.mql.addEventListener('change', this.mqlListener);
    }
    this.updateTheme();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['theme']) {
      this.updateTheme();
    }
  }

  ngOnDestroy() {
    if (this.mql) {
      this.mql.removeEventListener('change', this.mqlListener);
    }
  }

  private mqlListener = (e: MediaQueryListEvent) => {
    this.systemPrefersDark = e.matches;
    this.updateTheme();
  };

  private updateTheme() {
    this.isDark = this.theme.mode === 'dark' || (this.theme.mode === 'auto' && this.systemPrefersDark);
    const resolvedTheme = (this.isDark && this.theme.dark) 
      ? { ...this.theme, ...this.theme.dark } 
      : this.theme;

    const vars: Record<string, string> = {};
    for (const [tokenName, cssVar] of Object.entries(TOKEN_TO_CSS_VAR)) {
      const value = resolvedTheme[tokenName as keyof NarrativeTheme];
      if (typeof value === 'string' && value.length > 0) {
        vars[cssVar] = value;
      }
    }
    this.cssVars = vars;
  }
}
