import type { NarrativeField } from "./types";

function fieldToCode(f: NarrativeField): string {
  const lines: string[] = [];
  lines.push(`  {`);
  lines.push(`    key: "${f.key}",`);
  lines.push(`    type: "${f.type}",`);
  lines.push(`    prefix: "${f.prefix}",`);
  if (f.placeholder) lines.push(`    placeholder: "${f.placeholder}",`);
  if (f.options) lines.push(`    options: [${f.options.map((o) => `"${o}"`).join(", ")}],`);
  if (f.validation) {
    const v = f.validation;
    const parts: string[] = [];
    if (v.required) parts.push(`required: true`);
    if (v.minLength) parts.push(`minLength: ${v.minLength}`);
    if (v.exactLength) parts.push(`exactLength: ${v.exactLength}`);
    if (v.isEmail) parts.push(`isEmail: true`);
    if (v.pattern) parts.push(`pattern: ${v.pattern.toString()}`);
    if (v.custom) parts.push(`custom: (value) => /* your rule */ true`);
    if (parts.length) {
      lines.push(`    validation: { ${parts.join(", ")} },`);
    }
  }
  lines.push(`  },`);
  return lines.join("\n");
}

export function presetToCode(fields: NarrativeField[], doneCta: string): string {
  return `import { NarrativeForm } from "@viveksinghind/narrative-form-react";

const fields = [
${fields.map(fieldToCode).join("\n")}
];

export default function SignUp() {
  return (
    <NarrativeForm
      fields={fields}
      done={{
        ctaLabel: "${doneCta}",
        onSubmit: (values) => console.log(values),
      }}
    />
  );
}`;
}
