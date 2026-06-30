const classGroups = [
  {
    title: "Wrapper & Layout",
    rows: [
      ["ns-root", "Outermost wrapper"],
      ["ns-page", "Mobile page container"],
      ["ns-letter", "The growing letter container"],
    ],
  },
  {
    title: "Per Line",
    rows: [
      ["ns-line", "Each sentence row"],
      ["ns-line--confirmed", "Line that has been confirmed"],
      ["ns-line--editing", "Line in edit mode"],
      ["ns-line-[key]", "e.g. ns-line-name, ns-line-phone"],
    ],
  },
  {
    title: "Input",
    rows: [
      ["ns-input-wrap", "Wraps input and enter button"],
      ["ns-input", "The actual input element"],
      ["ns-input--error", "Validation failed"],
      ["ns-enter-btn", "The ↵ confirm button"],
    ],
  },
  {
    title: "Filled / Confirmed",
    rows: [
      ["ns-filled-wrap", "Wraps filled text and edit icon"],
      ["ns-filled-value", "The confirmed italic text"],
      ["ns-edit-btn", "Pencil edit icon button"],
    ],
  },
  {
    title: "Chips",
    rows: [
      ["ns-chips-wrap", "Wraps all chips"],
      ["ns-chip", "Individual chip"],
      ["ns-chip--active", "Selected chip"],
    ],
  },
  {
    title: "Errors",
    rows: [
      ["ns-error-text", "The error message"],
      ["ns-error-text--shake", "Shake animation variant"],
    ],
  },
];

export default function CssClassesPage() {
  return (
    <div className="doc-page">
      <p className="doc-eyebrow">THEMING</p>
      <h1 id="overview">CSS Classes</h1>
      <p className="doc-lead">
        Every element exposes a predictable, <code>ns-</code> prefixed class so you can override
        styles directly without fighting specificity.
      </p>

      {classGroups.map((group) => (
        <div key={group.title}>
          <h2 id={group.title.toLowerCase().replace(/[^a-z]+/g, "-")}>{group.title}</h2>
          <table className="doc-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Element</th>
              </tr>
            </thead>
            <tbody>
              {group.rows.map(([cls, desc]) => (
                <tr key={cls}>
                  <td><code>{cls}</code></td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export const toc = [
  { id: "overview", label: "CSS Classes" },
  ...classGroups.map((g) => ({ id: g.title.toLowerCase().replace(/[^a-z]+/g, "-"), label: g.title })),
];
