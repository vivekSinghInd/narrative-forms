import CodeBlock from "../CodeBlock";
import Callout from "../Callout";

export default function DynamicFormsPage() {
  return (
    <div className="doc-page">
      <p className="doc-eyebrow">CORE CONCEPTS</p>
      <h1 id="overview">Dynamic Forms</h1>
      <p className="doc-lead">
        Fetch your entire field configuration from a database — change copy, validation, or
        order without a redeploy.
      </p>

      <h2 id="three-modes">Three modes</h2>
      <CodeBlock
        lang="jsx"
        code={`// 1. URL — the component fetches itself
<NarrativeForm fieldsUrl="/api/signup-form" />

// 2. Pre-fetched object — you control the fetch
<NarrativeForm formConfig={configFromServer} />

// 3. Static — same as every other example on this site
<NarrativeForm fields={[...]} />`}
      />

      <h2 id="api-contract">API response contract</h2>
      <CodeBlock
        lang="json"
        code={`{
  "form": { "id": "uuid", "name": "investor_signup", "version": 3 },
  "welcome": { "heading": "Welcome!", "subtext": "Let's get to know you." },
  "fields": [
    {
      "key": "name",
      "prefix": "My name is",
      "type": "text",
      "validation": { "required": true, "minLength": 2 }
    }
  ],
  "theme": { "background": "#faf8f5" },
  "done": { "message": "That's all we need, {name}.", "ctaLabel": "Send OTP →" }
}`}
      />

      <h2 id="db-schema">Database schema</h2>
      <p>
        A minimal three-table layout — <code>forms</code>, <code>form_fields</code>, and{" "}
        <code>form_themes</code> — is enough to drive everything above.
      </p>
      <CodeBlock
        lang="sql"
        code={`-- forms
id, name, description, is_active, version

-- form_fields
id, form_id, key, prefix, suffix, type,
placeholder, order, is_required, validation (jsonb),
options (jsonb), show_if (jsonb)

-- form_themes
id, form_id, background, text_color, font_family, ...`}
      />

      <h2 id="versioning">Form versioning</h2>
      <p>
        <code>onComplete</code> receives a <code>meta</code> object alongside the values —
        including which form version produced the submission, so you can A/B test copy and
        field order safely.
      </p>
      <CodeBlock
        lang="jsx"
        code={`onComplete: (values, meta) => {
  // meta.formId, meta.formVersion,
  // meta.totalTimeMs, meta.fieldTimings
}`}
      />

      <Callout type="warning">
        Always validate the JSON schema server-side and sanitise any prefix, suffix, or option
        strings before serving them — never trust raw database content as safe HTML.
      </Callout>
    </div>
  );
}

export const toc = [
  { id: "overview", label: "Dynamic Forms" },
  { id: "three-modes", label: "Three Modes" },
  { id: "api-contract", label: "API Contract" },
  { id: "db-schema", label: "Database Schema" },
  { id: "versioning", label: "Form Versioning" },
];
