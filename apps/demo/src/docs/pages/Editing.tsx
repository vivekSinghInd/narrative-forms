import NarrativeForm from "../../engine/NarrativeForm";
import PreviewCode from "../PreviewCode";

export default function EditingPage() {
  return (
    <div className="doc-page">
      <p className="doc-eyebrow">CORE CONCEPTS</p>
      <h1 id="overview">Editing &amp; Edit Icon</h1>
      <p className="doc-lead">
        Once a field is confirmed, a quiet pencil icon lets the user reopen it — without
        resetting the page.
      </p>

      <h2 id="how-it-works">How it works</h2>
      <p>
        Fill the field below and confirm it, then tap the pencil that appears next to your
        answer.
      </p>

      <PreviewCode
        title="EditDemo.jsx"
        preview={
          <NarrativeForm
            fields={[
              {
                key: "name",
                type: "text",
                prefix: "My name is",
                placeholder: "your name",
                validation: { required: true, minLength: 2 },
              },
              {
                key: "city",
                type: "text",
                prefix: "and I live in",
                placeholder: "your city",
                validation: { required: true },
              },
            ]}
            welcomeHeading=""
            doneMessage={(v) => `${v.name} from ${v.city} — got it.`}
          />
        }
        code={`// editable is true by default on every field
{
  key: "name",
  type: "text",
  prefix: "My name is",
  validation: { required: true, minLength: 2 },
}`}
      />

      <h2 id="behaviour">Behaviour</h2>
      <ul className="doc-list">
        <li>The filled text turns back into an input, pre-filled with the current value</li>
        <li>Lines below stay visible — the page doesn't collapse or reset</li>
        <li>Confirming again restores the filled state and the pencil icon</li>
        <li>Pressing <kbd>Escape</kbd> while editing reverts to the last confirmed value</li>
      </ul>

      <h2 id="step-locking">Step locking</h2>
      <p>
        Some fields shouldn't stay editable forever — for example, once an OTP screen appears,
        the phone number it was sent to should be locked.
      </p>
      <pre className="codeblock-inline mono">
        {`{ key: "otp", type: "otp", prefix: "My code is", lockPrevious: true }`}
      </pre>
    </div>
  );
}

export const toc = [
  { id: "overview", label: "Editing & Edit Icon" },
  { id: "how-it-works", label: "How It Works" },
  { id: "behaviour", label: "Behaviour" },
  { id: "step-locking", label: "Step Locking" },
];
