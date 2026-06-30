import { useState, type ReactNode } from "react";

export default function PreviewCode({
  title,
  preview,
  code,
}: {
  title?: string;
  preview: ReactNode;
  code: string;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="pc-block">
      {title && <p className="pc-title mono">{title}</p>}
      <div className="pc-card">
        <div className="pc-stage">{preview}</div>
      </div>
      <div className="pc-toolbar">
        <div className="pc-tabs">
          <button
            className={`pc-tab${tab === "preview" ? " pc-tab--active" : ""}`}
            onClick={() => setTab("preview")}
            type="button"
          >
            Preview
          </button>
          <button
            className={`pc-tab${tab === "code" ? " pc-tab--active" : ""}`}
            onClick={() => setTab("code")}
            type="button"
          >
            Code
          </button>
        </div>
        <button className="pc-copy" onClick={copy} type="button">
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      {tab === "code" && (
        <pre className="pc-code mono">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
