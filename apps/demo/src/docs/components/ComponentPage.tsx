import NarrativeForm from "../../engine/NarrativeForm";
import PreviewCode from "../PreviewCode";
import CodeBlock from "../CodeBlock";
import type { NarrativeField } from "../../engine/types";

import { useFramework } from "../FrameworkContext";

export interface ComponentExample {
  id: string;
  title: string;
  field: NarrativeField;
  code: string;
}

export interface ComponentPageConfig {
  name: string;
  description: string;
  importLine: (fw: string) => string;
  basicField: NarrativeField;
  examples: ComponentExample[];
}

export default function ComponentPage({ config }: { config: ComponentPageConfig }) {
  const { framework } = useFramework();

  return (
    <div className="doc-page">
      <p className="doc-breadcrumb">
        COMPONENTS <span>›</span> FIELD
      </p>
      <h1 id="overview">{config.name}</h1>
      <p className="doc-lead">{config.description}</p>

      <h2 id="usage">Usage</h2>
      <CodeBlock lang="import" code={config.importLine(framework)} />
      <CodeBlock
        lang={framework === "vue" ? "template" : framework === "angular" ? "html" : "jsx"}
        code={
          framework === "vue"
            ? `<NarrativeForm :fields="[{ key: '${config.basicField.key}', type: '${config.basicField.type}', prefix: '${config.basicField.prefix}' }]" />`
            : framework === "angular"
            ? `<narrative-form [fields]="[{ key: '${config.basicField.key}', type: '${config.basicField.type}', prefix: '${config.basicField.prefix}' }]"></narrative-form>`
            : `{ key: "${config.basicField.key}", type: "${config.basicField.type}", prefix: "${config.basicField.prefix}" }`
        }
      />

      <h2 id="basic">Basic</h2>
      <PreviewCode
        preview={
          <NarrativeForm fields={[config.basicField]} welcomeHeading="" doneMessage={() => "Done."} />
        }
        code={JSON.stringify(config.basicField, (_k, v) => (v instanceof RegExp ? v.toString() : v), 2)}
      />

      {config.examples.map((ex) => (
        <div key={ex.id}>
          <h2 id={ex.id}>{ex.title}</h2>
          <PreviewCode
            preview={
              <NarrativeForm fields={[ex.field]} welcomeHeading="" doneMessage={() => "Done."} />
            }
            code={ex.code}
          />
        </div>
      ))}
    </div>
  );
}

export function buildToc(config: ComponentPageConfig) {
  return [
    { id: "overview", label: config.name },
    { id: "usage", label: "Usage" },
    { id: "basic", label: "Basic" },
    ...config.examples.map((e) => ({ id: e.id, label: e.title })),
  ];
}
