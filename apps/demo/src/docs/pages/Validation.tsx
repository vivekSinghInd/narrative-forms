import NarrativeForm from "../../engine/NarrativeForm";
import PreviewCode from "../PreviewCode";
import CodeBlock from "../CodeBlock";
import Callout from "../Callout";

export default function ValidationPage() {
  return (
    <div className="doc-page">
      <p className="doc-eyebrow">CORE CONCEPTS</p>
      <h1 id="overview">Validation</h1>
      <p className="doc-lead">
        Built-in rules, custom functions, and the order they run in.
      </p>

      <h2 id="built-in">Built-in rules</h2>
      <p>Pass any of these inside a field's <code>validation</code> object.</p>
      <CodeBlock
        lang="type"
        code={`interface NarrativeValidation {
  required?: boolean;
  requiredMessage?: string;
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  isEmail?: boolean;
  custom?: (value, allValues) => true | string;
}`}
      />

      <h2 id="required-example">Required field</h2>
      <PreviewCode
        title="ValidationDemo.jsx"
        preview={
          <NarrativeForm
            fields={[
              {
                key: "name",
                type: "text",
                prefix: "My name is",
                placeholder: "your name",
                validation: { required: true, requiredMessage: "We need your name to continue" },
              },
            ]}
            welcomeHeading=""
            doneMessage={(v) => `Thanks, ${v.name}.`}
          />
        }
        code={`{
  key: "name",
  type: "text",
  prefix: "My name is",
  validation: {
    required: true,
    requiredMessage: "We need your name to continue",
  },
}`}
      />

      <h2 id="pattern-example">Pattern matching</h2>
      <PreviewCode
        title="ValidationDemo.jsx"
        preview={
          <NarrativeForm
            fields={[
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
            ]}
            welcomeHeading=""
            doneMessage={(v) => `Welcome, ${v.username}.`}
          />
        }
        code={`{
  key: "username",
  type: "text",
  prefix: "I'd like to be known as",
  sanitise: (v) => v.toLowerCase().trim(),
  validation: {
    required: true,
    minLength: 3,
    pattern: /^[a-z0-9_]+$/,
    patternMessage: "Lowercase letters, numbers, underscore only",
  },
}`}
      />

      <h2 id="custom-example">Custom validator function</h2>
      <p>
        <code>custom</code> receives the field's value and every other confirmed value, so you
        can validate one field against another — like confirming a password.
      </p>
      <PreviewCode
        title="ValidationDemo.jsx"
        preview={
          <NarrativeForm
            fields={[
              {
                key: "password",
                type: "password",
                prefix: "My password will be",
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
            ]}
            welcomeHeading=""
            doneMessage={() => `Password set.`}
          />
        }
        code={`{
  key: "password",
  type: "password",
  prefix: "My password will be",
  validation: {
    required: true,
    minLength: 8,
    custom: (value) =>
      /[A-Z]/.test(value) && /[0-9]/.test(value)
        ? true
        : "Add at least one capital letter and one number",
  },
}`}
      />

      <h2 id="priority">Validation priority order</h2>
      <p>Rules always run in this sequence. The first failure stops the chain.</p>
      <ol className="doc-ordered">
        <li>required</li>
        <li>minLength / maxLength</li>
        <li>exactLength</li>
        <li>pattern / isEmail</li>
        <li>registered plugin validators (<code>use</code>)</li>
        <li>custom synchronous rules</li>
        <li>custom asynchronous rules</li>
        <li>server-driven validation</li>
        <li>global cross-field validators</li>
      </ol>

      <h2 id="built-in-validators">Built-in validator library</h2>
      <p>Shipped out of the box — register once, reference by name anywhere.</p>
      <CodeBlock
        lang="type"
        code={`// India
"indianPhone"   "indianPincode"   "aadhaar"
"pan"           "gst"             "ifsc"

// Universal
"email"  "url"  "strongPassword"
"alphanumeric"  "noSpaces"  "futureDate"
"pastDate"  "minAge"`}
      />

      <Callout type="tip">
        Async rules always run last, so you never call your server for a username check before
        the basic length and pattern rules have already passed.
      </Callout>
    </div>
  );
}

export const toc = [
  { id: "overview", label: "Validation" },
  { id: "built-in", label: "Built-in Rules" },
  { id: "required-example", label: "Required Field" },
  { id: "pattern-example", label: "Pattern Matching" },
  { id: "custom-example", label: "Custom Validator" },
  { id: "priority", label: "Priority Order" },
  { id: "built-in-validators", label: "Built-in Validators" },
];
