import { useState } from "react";
import CodeBlock from "../CodeBlock";
import Callout from "../Callout";
import NarrativeForm from "../../engine/NarrativeForm";
import PreviewCode from "../PreviewCode";

export default function OverviewPage() {
  const [layout, setLayout] = useState<"lines" | "paragraph">("lines");
  return (
    <div className="doc-page">
      <p className="doc-eyebrow">GETTING STARTED</p>
      <h1 id="introduction">Overview</h1>
      <p className="doc-lead">
        A fresh, conversational way to collect user data without the traditional, rigid forms.
      </p>

      <h2 id="what-is-it">What is it?</h2>
      <p>
        <strong>Narrative Form</strong> replaces standard "boxes with labels" with a continuous,
        flowing sentence. As the user types, the sentence naturally unfolds like a typewriter.
        This provides a highly engaging, low-friction onboarding experience that feels like a conversation
        rather than a data-entry chore.
      </p>

      <PreviewCode
        title="Interactive Demo"
        preview={
          <NarrativeForm
            layout={layout}
            fields={[
              { key: "name", type: "text", prefix: "Hi! My name is", placeholder: "your name" },
              { key: "role", type: "chips", prefix: "and I am here as", options: ["a Developer", "a Designer", "a Founder"] },
              { key: "email", type: "email", prefix: "You can reach me at", placeholder: "email address" },
            ]}
            welcomeHeading="Let's build something."
            doneMessage={() => "Thanks! We'll be in touch."}
          />
        }
        code={`<NarrativeForm layout="${layout}" fields={fields} />`}
        topBar={
          <div className="framework-toggle" style={{ margin: "10px", marginLeft: "auto" }}>
            <button
              className={`fw-btn${layout === "lines" ? " fw-btn--active" : ""}`}
              onClick={() => setLayout("lines")}
            >
              Lines
            </button>
            <button
              className={`fw-btn${layout === "paragraph" ? " fw-btn--active" : ""}`}
              onClick={() => setLayout("paragraph")}
            >
              Paragraph
            </button>
          </div>
        }
      />

      <h2 id="features">Features</h2>
      <ul>
        <li><strong>Zero Dependencies:</strong> Extremely lightweight, dropping straight into your project.</li>
        <li><strong>Typewriter Effect:</strong> Text naturally types itself out as the user progresses.</li>
        <li><strong>Framework Agnostic:</strong> Available for React, Vue, Angular, and React Native.</li>
        <li><strong>Built-in Validation:</strong> Easily validate emails, numbers, exact lengths, or custom Regex patterns.</li>
        <li><strong>Keyboard Accessible:</strong> Fully operable via keyboard, with intuitive auto-advance functionality.</li>
      </ul>

      <Callout type="info">
        If you want a traditional, boring form, this is not the library for you. Narrative Form is
        designed specifically for creating immersive onboarding flows and conversational data collection.
      </Callout>

      <h2 id="next-steps">Next steps</h2>
      <p>
        Ready to dive in? Head over to the <a href="#docs/installation">Installation</a> guide to get started.
      </p>
    </div>
  );
}

export const toc = [
  { id: "introduction", label: "Overview" },
  { id: "what-is-it", label: "What is it?" },
  { id: "features", label: "Features" },
  { id: "next-steps", label: "Next Steps" },
];
