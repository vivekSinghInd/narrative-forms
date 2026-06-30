import type { ComponentPageConfig } from "./ComponentPage";

export const textConfig: ComponentPageConfig = {
  name: "Text",
  description: "A freeform text field — names, cities, usernames, anything that's plain text.",
  importLine: (fw: string) => `import { NarrativeForm } from "@viveksinghind/narrative-form-${fw}";`,
  basicField: { key: "name", type: "text", prefix: "My name is", placeholder: "your name" },
  examples: [
    {
      id: "validated",
      title: "With validation",
      field: {
        key: "name",
        type: "text",
        prefix: "My name is",
        placeholder: "your name",
        validation: { required: true, minLength: 2, pattern: /^[a-zA-Z\s]+$/, patternMessage: "Letters only" },
      },
      code: `{
  key: "name",
  type: "text",
  prefix: "My name is",
  validation: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\\s]+$/,
    patternMessage: "Letters only",
  },
}`,
    },
  ],
};

export const emailConfig: ComponentPageConfig = {
  name: "Email",
  description: "Validated email input with the device email keyboard on mobile.",
  importLine: (fw: string) => `import { NarrativeForm } from "@viveksinghind/narrative-form-${fw}";`,
  basicField: { key: "email", type: "email", prefix: "Send my invite to", placeholder: "you@email.com" },
  examples: [
    {
      id: "validated",
      title: "With email validation",
      field: {
        key: "email",
        type: "email",
        prefix: "Send my invite to",
        placeholder: "you@email.com",
        validation: { required: true, isEmail: true },
      },
      code: `{
  key: "email",
  type: "email",
  prefix: "Send my invite to",
  validation: { required: true, isEmail: true },
}`,
    },
  ],
};

export const passwordConfig: ComponentPageConfig = {
  name: "Password",
  description: "Masked input with optional show/hide toggle and strength rules.",
  importLine: (fw: string) => `import { NarrativeForm } from "@viveksinghind/narrative-form-${fw}";`,
  basicField: { key: "password", type: "password", prefix: "My password will be", placeholder: "min 8 characters" },
  examples: [
    {
      id: "strength",
      title: "With strength rule",
      field: {
        key: "password",
        type: "password",
        prefix: "My password will be",
        placeholder: "min 8 characters",
        validation: {
          required: true,
          minLength: 8,
          custom: (v) => (/[A-Z]/.test(v) && /[0-9]/.test(v) ? true : "Add a capital letter and a number"),
        },
      },
      code: `{
  key: "password",
  type: "password",
  prefix: "My password will be",
  validation: {
    required: true,
    minLength: 8,
    custom: (value) =>
      /[A-Z]/.test(value) && /[0-9]/.test(value)
        ? true
        : "Add a capital letter and a number",
  },
}`,
    },
  ],
};

export const numberConfig: ComponentPageConfig = {
  name: "Number",
  description: "Numeric-only input — age, pincode, amount.",
  importLine: (fw: string) => `import { NarrativeForm } from "@viveksinghind/narrative-form-${fw}";`,
  basicField: { key: "age", type: "number", prefix: "I am", suffix: "years old", placeholder: "age" },
  examples: [
    {
      id: "range",
      title: "With min / max",
      field: {
        key: "age",
        type: "number",
        prefix: "I am",
        placeholder: "age",
        validation: {
          required: true,
          custom: (v) => {
            const n = Number(v);
            if (n < 18) return "Must be at least 18";
            if (n > 100) return "Must be under 100";
            return true;
          },
        },
      },
      code: `{
  key: "age",
  type: "number",
  prefix: "I am",
  validation: {
    required: true,
    custom: (value) => {
      const n = Number(value);
      if (n < 18) return "Must be at least 18";
      if (n > 100) return "Must be under 100";
      return true;
    },
  },
}`,
    },
  ],
};

export const telConfig: ComponentPageConfig = {
  name: "Tel",
  description: "Phone number input with numeric keyboard and automatic paste sanitising.",
  importLine: (fw: string) => `import { NarrativeForm } from "@viveksinghind/narrative-form-${fw}";`,
  basicField: {
    key: "phone",
    type: "tel",
    prefix: "and my number is",
    placeholder: "10-digit mobile",
    sanitise: (v) => v.replace(/\D/g, "").slice(-10),
  },
  examples: [
    {
      id: "indian",
      title: "Indian mobile validator",
      field: {
        key: "phone",
        type: "tel",
        prefix: "and my number is",
        placeholder: "10-digit mobile",
        sanitise: (v) => v.replace(/\D/g, "").slice(-10),
        validation: { required: true, exactLength: 10, exactLengthMessage: "Enter a valid 10-digit number" },
      },
      code: `{
  key: "phone",
  type: "tel",
  prefix: "and my number is",
  sanitise: (v) => v.replace(/\\D/g, "").slice(-10),
  validation: {
    required: true,
    exactLength: 10,
    exactLengthMessage: "Enter a valid 10-digit number",
  },
}`,
    },
  ],
};

export const chipsConfig: ComponentPageConfig = {
  name: "Chips",
  description: "Tap to select one option — auto-confirms by default, no ↵ required.",
  importLine: (fw: string) => `import { NarrativeForm } from "@viveksinghind/narrative-form-${fw}";`,
  basicField: {
    key: "role",
    type: "chips",
    prefix: "I'm here as",
    options: ["an Investor", "a Research Analyst"],
  },
  examples: [
    {
      id: "required",
      title: "Required selection",
      field: {
        key: "plan",
        type: "chips",
        prefix: "I'd like the",
        options: ["Starter", "Pro", "Enterprise"],
        validation: { required: true },
      },
      code: `{
  key: "plan",
  type: "chips",
  prefix: "I'd like the",
  options: ["Starter", "Pro", "Enterprise"],
  validation: { required: true },
}`,
    },
  ],
};

export const multiChipsConfig: ComponentPageConfig = {
  name: "Multi-Chips",
  description: "Select multiple options — does not auto-advance, requires explicit confirm.",
  importLine: (fw: string) => `import { NarrativeForm } from "@viveksinghind/narrative-form-${fw}";`,
  basicField: {
    key: "interests",
    type: "chips",
    prefix: "I'm interested in",
    options: ["Stocks", "Mutual Funds", "Crypto", "Bonds"],
  },
  examples: [],
};

export const selectConfig: ComponentPageConfig = {
  name: "Select",
  description: "An inline dropdown for longer option lists where chips would wrap awkwardly.",
  importLine: (fw: string) => `import { NarrativeForm } from "@viveksinghind/narrative-form-${fw}";`,
  basicField: {
    key: "country",
    type: "chips",
    prefix: "and I'm based in",
    options: ["India", "United States", "United Kingdom"],
  },
  examples: [],
};

export const dateConfig: ComponentPageConfig = {
  name: "Date",
  description: "Inline date picker — birthdate, start date, deadline.",
  importLine: (fw: string) => `import { NarrativeForm } from "@viveksinghind/narrative-form-${fw}";`,
  basicField: { key: "dob", type: "text", prefix: "I was born on", placeholder: "DD/MM/YYYY" },
  examples: [],
};

export const otpConfig: ComponentPageConfig = {
  name: "OTP",
  description: "N-digit boxes with auto-advance focus, paste distribution, and resend countdown.",
  importLine: (fw: string) => `import { NarrativeForm } from "@viveksinghind/narrative-form-${fw}";`,
  basicField: {
    key: "otp",
    type: "text",
    prefix: "My verification code is",
    placeholder: "6-digit code",
    validation: { required: true, exactLength: 6, exactLengthMessage: "Enter all 6 digits" },
  },
  examples: [],
};
