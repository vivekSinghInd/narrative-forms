import type { NarrativeField } from "./types";

export interface Preset {
  id: string;
  label: string;
  description: string;
  doneCta: string;
  fields: NarrativeField[];
  doneMessage: (v: Record<string, string>) => string;
}

export const presets: Preset[] = [
  {
    id: "investor-signup",
    label: "Investor Sign-Up",
    description: "Fintech onboarding — name, mobile, and role in one breath.",
    doneCta: "Send OTP →",
    fields: [
      {
        key: "name",
        type: "text",
        prefix: "My name is",
        placeholder: "your name",
        validation: { required: true, minLength: 2, patternMessage: "Letters only", pattern: /^[a-zA-Z\s]+$/ },
      },
      {
        key: "phone",
        type: "tel",
        prefix: "and my number is",
        placeholder: "10-digit mobile",
        sanitise: (v) => v.replace(/\D/g, "").slice(-10),
        validation: { required: true, exactLength: 10, exactLengthMessage: "Enter a valid 10-digit number" },
      },
      {
        key: "role",
        type: "chips",
        prefix: "I'm here as",
        options: ["an Investor", "a Research Analyst"],
        validation: { required: true },
      },
    ],
    doneMessage: (v) =>
      `That's all we need, ${v.name}. We'll text an OTP to +91 ${v.phone} to verify your number.`,
  },
  {
    id: "waitlist",
    label: "Product Waitlist",
    description: "A single-line capture for early access — email and one preference.",
    doneCta: "Join waitlist →",
    fields: [
      {
        key: "email",
        type: "email",
        prefix: "Send my invite to",
        placeholder: "you@email.com",
        validation: { required: true, isEmail: true },
      },
      {
        key: "use",
        type: "chips",
        prefix: "and I'll mostly use it for",
        options: ["work", "personal projects", "just curious"],
        validation: { required: true },
      },
    ],
    doneMessage: (v) => `Got it. We'll email ${v.email} the moment a spot opens up.`,
  },
  {
    id: "account-security",
    label: "Account + Password",
    description: "Username with live pattern checks and a password field.",
    doneCta: "Create account →",
    fields: [
      {
        key: "username",
        type: "text",
        prefix: "I'd like to be known as",
        placeholder: "username",
        sanitise: (v) => v.toLowerCase().trim(),
        validation: {
          required: true,
          minLength: 3,
          pattern: /^[a-z0-9_]+$/,
          patternMessage: "Lowercase letters, numbers, underscore only",
        },
      },
      {
        key: "password",
        type: "password",
        prefix: "and my password will be",
        placeholder: "min 8 characters",
        validation: {
          required: true,
          minLength: 8,
          custom: (v) =>
            /[A-Z]/.test(v) && /[0-9]/.test(v)
              ? true
              : "Add at least one capital letter and one number",
        },
      },
    ],
    doneMessage: (v) => `Welcome aboard, ${v.username}. Your account is ready.`,
  },
  {
    id: "feedback",
    label: "Post-Purchase Feedback",
    description: "A short, human review prompt instead of a star-rating widget.",
    doneCta: "Submit feedback →",
    fields: [
      {
        key: "rating",
        type: "chips",
        prefix: "Overall, this order was",
        options: ["excellent", "good", "okay", "disappointing"],
        validation: { required: true },
      },
      {
        key: "name",
        type: "text",
        prefix: "— signed,",
        placeholder: "your name (optional)",
      },
    ],
    doneMessage: () => `Thank you — that helps us more than a star rating ever could.`,
  },
];
