import NarrativeForm from "../../engine/NarrativeForm";
import PreviewCode from "../PreviewCode";
import CodeBlock from "../CodeBlock";

export default function ThemingPage() {
  return (
    <div className="doc-page">
      <p className="doc-eyebrow">THEMING</p>
      <h1 id="overview">Theming</h1>
      <p className="doc-lead">
        Every visual property is a token. Override what you need, leave the rest at default.
      </p>

      <h2 id="tokens">Available tokens</h2>
      <CodeBlock
        lang="type"
        code={`interface NarrativeTheme {
  background?: string;
  textColor?: string;
  inputBorderColor?: string;
  placeholderColor?: string;
  errorColor?: string;
  filledColor?: string;
  fontFamily?: string;
  uiFontFamily?: string;
  buttonRadius?: string;
  buttonBackground?: string;
  buttonColor?: string;
  chipBorderRadius?: string;
  chipActiveBackground?: string;
  mode?: "light" | "dark" | "auto";
}`}
      />

      <h2 id="example">Custom theme example</h2>
      <PreviewCode
        title="ThemedForm.jsx"
        preview={
          <NarrativeForm
            fields={[
              {
                key: "name",
                type: "text",
                prefix: "My name is",
                placeholder: "your name",
                validation: { required: true },
              },
              {
                key: "plan",
                type: "chips",
                prefix: "and I'd like the",
                options: ["Starter", "Pro", "Enterprise"],
                validation: { required: true },
              },
            ]}
            welcomeHeading=""
            doneMessage={(v) => `${v.name}, you're on the ${v.plan} plan.`}
          />
        }
        code={`<NarrativeForm
  fields={fields}
  theme={{
    background: "#0b1220",
    textColor: "#e8edf5",
    accent: "#2563eb",
    fontFamily: "'Fraunces', serif",
  }}
/>`}
      />

      <h2 id="css-vars">CSS variable approach</h2>
      <p>
        Internally, theme tokens map onto CSS custom properties scoped to <code>.ns-root</code>,
        so you can also override them directly in your own stylesheet.
      </p>
      <CodeBlock
        lang="css"
        code={`.ns-root {
  --ink: #0b1220;
  --accent: #2563eb;
  --paper: #f5f7fb;
}`}
      />
    </div>
  );
}

export const toc = [
  { id: "overview", label: "Theming" },
  { id: "tokens", label: "Available Tokens" },
  { id: "example", label: "Custom Theme" },
  { id: "css-vars", label: "CSS Variables" },
];
