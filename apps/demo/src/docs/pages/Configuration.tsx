import CodeBlock from "../CodeBlock";
import { useFramework } from "../FrameworkContext";

export default function ConfigurationPage() {
  const { framework } = useFramework();
  return (
    <div className="doc-page">
      <p className="doc-eyebrow">GUIDES</p>
      <h1 id="overview">Configuration</h1>
      <p className="doc-lead">The shape of a field, and every prop NarrativeForm accepts.</p>

      <h2 id="field-shape">Field shape</h2>
      <p>Every entry in <code>fields</code> describes one sentence fragment plus its input.</p>

      <CodeBlock
        lang="type"
        code={`interface NarrativeField {
  key: string;              // unique identifier
  type: FieldType;          // "text" | "tel" | "email" | "password" |
                             // "number" | "select" | "chips" |
                             // "multi-chips" | "date" | "otp"
  prefix: string;           // sentence text before the input
  suffix?: string;          // sentence text after the input
  placeholder?: string;
  options?: string[];       // for chips / select / multi-chips
  autoAdvance?: boolean;    // auto-confirm without pressing ↵
  validation?: NarrativeValidation;
  sanitise?: (value: string) => string;
}`}
      />

      <h2 id="root-props">Root component props</h2>
      <CodeBlock
        lang={framework === "vue" ? "template" : framework === "angular" ? "html" : "jsx"}
        code={
          framework === "vue" ? `<NarrativeForm
  :fields="fields"
  :welcome="{ heading: 'Welcome!', subtext: 'Let\\'s get to know you.' }"
  :done="{
    ctaLabel: 'Continue →',
    onSubmit: (values) => {},
  }"
  :theme="{ /* see Theming guide */ }"
  :typewriter="{ speed: 38, cursor: true }"
  @complete="(values, meta) => {}"
/>` : framework === "angular" ? `<narrative-form
  [fields]="fields"
  [welcome]="{ heading: 'Welcome!', subtext: 'Let\\'s get to know you.' }"
  [done]="{
    ctaLabel: 'Continue →',
    onSubmit: onDoneSubmit
  }"
  [theme]="{ /* see Theming guide */ }"
  [typewriter]="{ speed: 38, cursor: true }"
  (complete)="onComplete($event)"
></narrative-form>` : `<NarrativeForm
  fields={fields}
  welcome={{ heading: "Welcome!", subtext: "Let's get to know you." }}
  done={{
    ctaLabel: "Continue →",
    onSubmit: (values) => {},
  }}
  theme={{ /* see Theming guide */ }}
  typewriter={{ speed: 38, cursor: true }}
  onComplete={(values, meta) => {}}
/>`
        }
      />

      <h2 id="example">Full example</h2>
      <CodeBlock
        lang={framework === "vue" ? "SignUp.vue" : framework === "angular" ? "sign-up.component.ts" : "SignUp.jsx"}
        code={
          framework === "vue" ? `<script setup>
import { NarrativeForm } from "@viveksinghind/narrative-form-vue";

const fields = [
  {
    key: "name",
    type: "text",
    prefix: "My name is",
    placeholder: "your name",
    validation: { required: true, minLength: 2 },
  },
  {
    key: "phone",
    type: "tel",
    prefix: "and my number is",
    placeholder: "10-digit mobile",
    sanitise: (v) => v.replace(/\\D/g, "").slice(-10),
    validation: { required: true, exactLength: 10 },
  },
  {
    key: "role",
    type: "chips",
    prefix: "I'm here as",
    options: ["an Investor", "a Research Analyst"],
    validation: { required: true },
  },
];
</script>

<template>
  <NarrativeForm
    :fields="fields"
    :done="{
      ctaLabel: 'Send OTP →',
      onSubmit: (values) => console.log(values),
    }"
  />
</template>` : framework === "angular" ? `import { Component } from '@angular/core';
import { NarrativeFormComponent } from '@viveksinghind/narrative-form-angular';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [NarrativeFormComponent],
  template: \`
    <narrative-form
      [fields]="fields"
      [done]="{ ctaLabel: 'Send OTP →', onSubmit: onComplete }"
    ></narrative-form>
  \`
})
export class SignUpComponent {
  fields = [
    {
      key: "name",
      type: "text",
      prefix: "My name is",
      placeholder: "your name",
      validation: { required: true, minLength: 2 },
    },
    {
      key: "phone",
      type: "tel",
      prefix: "and my number is",
      placeholder: "10-digit mobile",
      sanitise: (v: string) => v.replace(/\\D/g, "").slice(-10),
      validation: { required: true, exactLength: 10 },
    },
    {
      key: "role",
      type: "chips",
      prefix: "I'm here as",
      options: ["an Investor", "a Research Analyst"],
      validation: { required: true },
    },
  ];

  onComplete = (values: any) => console.log(values);
}` : framework === "native" ? `import { NarrativeForm } from "@viveksinghind/narrative-form-native";

const fields = [
  {
    key: "name",
    type: "text",
    prefix: "My name is",
    placeholder: "your name",
    validation: { required: true, minLength: 2 },
  },
  {
    key: "phone",
    type: "tel",
    prefix: "and my number is",
    placeholder: "10-digit mobile",
    sanitise: (v) => v.replace(/\\D/g, "").slice(-10),
    validation: { required: true, exactLength: 10 },
  },
  {
    key: "role",
    type: "chips",
    prefix: "I'm here as",
    options: ["an Investor", "a Research Analyst"],
    validation: { required: true },
  },
];

export default function SignUp() {
  return (
    <NarrativeForm
      fields={fields}
      done={{
        ctaLabel: "Send OTP →",
        onSubmit: (values) => console.log(values),
      }}
    />
  );
}` : `import { NarrativeForm } from "@viveksinghind/narrative-form-react";

const fields = [
  {
    key: "name",
    type: "text",
    prefix: "My name is",
    placeholder: "your name",
    validation: { required: true, minLength: 2 },
  },
  {
    key: "phone",
    type: "tel",
    prefix: "and my number is",
    placeholder: "10-digit mobile",
    sanitise: (v) => v.replace(/\\D/g, "").slice(-10),
    validation: { required: true, exactLength: 10 },
  },
  {
    key: "role",
    type: "chips",
    prefix: "I'm here as",
    options: ["an Investor", "a Research Analyst"],
    validation: { required: true },
  },
];

export default function SignUp() {
  return (
    <NarrativeForm
      fields={fields}
      done={{
        ctaLabel: "Send OTP →",
        onSubmit: (values) => console.log(values),
      }}
    />
  );
}`
        }
      />

      <h2 id="next-steps">Next steps</h2>
      <p>
        See <a href="#docs/validation">Validation</a> for the full rules engine, or browse the{" "}
        <a href="#docs/text">Components</a> section for each field type in isolation.
      </p>
    </div>
  );
}

export const toc = [
  { id: "overview", label: "Configuration" },
  { id: "field-shape", label: "Field Shape" },
  { id: "root-props", label: "Root Props" },
  { id: "example", label: "Full Example" },
  { id: "next-steps", label: "Next Steps" },
];
