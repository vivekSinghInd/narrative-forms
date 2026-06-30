import CodeBlock from "../CodeBlock";
import Callout from "../Callout";

export default function DarkModePage() {
  return (
    <div className="doc-page">
      <p className="doc-eyebrow">THEMING</p>
      <h1 id="overview">Dark Mode</h1>
      <p className="doc-lead">
        Three modes — light, dark, and auto, which follows the user's system preference.
      </p>

      <h2 id="usage">Usage</h2>
      <CodeBlock
        lang="jsx"
        code={`<NarrativeForm
  fields={fields}
  theme={{
    mode: "auto",
    dark: {
      background: "#15171c",
      textColor: "#f3f1ea",
      inputBorderColor: "#f3f1ea",
    },
  }}
/>`}
      />

      <p>
        Try the moon icon in the top right of this site — it toggles the same{" "}
        <code>prefers-color-scheme</code> logic the package uses internally.
      </p>

      <Callout type="tip">
        <code>auto</code> mode listens to <code>prefers-color-scheme</code> live, so the form
        switches instantly if the user changes their OS theme mid-session — no reload needed.
      </Callout>
    </div>
  );
}

export const toc = [
  { id: "overview", label: "Dark Mode" },
  { id: "usage", label: "Usage" },
];
