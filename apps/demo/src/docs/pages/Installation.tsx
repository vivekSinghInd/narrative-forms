import CodeBlock from "../CodeBlock";
import Callout from "../Callout";
import { useFramework } from "../FrameworkContext";

const nameMap = { react: "React", vue: "Vue 3", angular: "Angular", native: "React Native" };
const langMap = { react: "SignUp.jsx", vue: "SignUp.vue", angular: "sign-up.component.ts", native: "SignUp.tsx" };

function getUsageCode(framework: string) {
  if (framework === "vue") {
    return `<script setup>
import { NarrativeForm } from "@viveksinghind/narrative-form-vue";

const fields = [
  { key: "name", type: "text", prefix: "My name is" },
  { key: "phone", type: "tel", prefix: "and my number is" },
];
</script>

<template>
  <NarrativeForm
    :fields="fields"
    :done="{ onSubmit: (values) => console.log(values) }"
  />
</template>`;
  }
  if (framework === "angular") {
    return `import { Component } from '@angular/core';
import { NarrativeFormComponent } from '@viveksinghind/narrative-form-angular';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [NarrativeFormComponent],
  template: \`
    <narrative-form
      [fields]="fields"
      [done]="{ onSubmit: onComplete }"
    ></narrative-form>
  \`
})
export class SignUpComponent {
  fields = [
    { key: "name", type: "text", prefix: "My name is" },
    { key: "phone", type: "tel", prefix: "and my number is" },
  ];
  onComplete = (values: any) => console.log(values);
}`;
  }
  if (framework === "native") {
    return `import { NarrativeForm } from "@viveksinghind/narrative-form-native";

const fields = [
  { key: "name", type: "text", prefix: "My name is" },
  { key: "phone", type: "tel", prefix: "and my number is" },
];

export default function SignUp() {
  return (
    <NarrativeForm
      fields={fields}
      done={{ onSubmit: (values) => console.log(values) }}
    />
  );
}`;
  }
  // React
  return `import { NarrativeForm } from "@viveksinghind/narrative-form-react";

const fields = [
  { key: "name", type: "text", prefix: "My name is" },
  { key: "phone", type: "tel", prefix: "and my number is" },
];

export default function SignUp() {
  return (
    <NarrativeForm
      fields={fields}
      done={{ onSubmit: (values) => console.log(values) }}
    />
  );
}`;
}

export default function InstallationPage() {
  const { framework } = useFramework();
  const fwName = nameMap[framework];

  return (
    <div className="doc-page">
      <p className="doc-eyebrow">GUIDES</p>
      <h1 id="overview">Installation</h1>
      <p className="doc-lead">Setting up narrative-form in a {fwName} project.</p>

      <h2 id="download">Download</h2>
      <p>narrative-form is available for download on the npm registry.</p>

      <CodeBlock
        lang="terminal"
        code={`# Using npm\nnpm install @viveksinghind/narrative-form-${framework}\n\n# Using yarn\nyarn add @viveksinghind/narrative-form-${framework}\n\n# Using pnpm\npnpm add @viveksinghind/narrative-form-${framework}`}
      />

      <h2 id="usage">Usage</h2>
      <p>
        Import <code>NarrativeForm</code> and pass a <code>fields</code> array — each field is a
        sentence fragment plus an input, not a traditional labelled box.
      </p>

      <CodeBlock lang={langMap[framework]} code={getUsageCode(framework)} />

      <h2 id="peer-deps">Peer dependencies</h2>
      <p>
        {fwName} is required as a peer dependency. The package ships zero runtime
        dependencies of its own and stays under 10KB gzipped.
      </p>

      <Callout type="info">
        Make sure you use a modern build tool. If you encounter issues, check the{" "}
        <a href="https://github.com/vivekSinghInd/narrative-form" target="_blank" rel="noreferrer">
          GitHub repo
        </a>{" "}
        for known constraints.
      </Callout>

      <h2 id="verify">Verify</h2>
      <p>
        Run your dev server and you should see the first line of your form begin typing itself
        out automatically. If nothing appears, confirm {fwName} is installed and that the
        component is mounted inside the DOM, not server-rendered without hydration.
      </p>

      <h2 id="next-steps">Next steps</h2>
      <p>
        Head to <a href="#docs/configuration">Configuration</a> to learn the full field shape, or
        jump straight into the <a href="#docs/text">Components</a> reference.
      </p>
    </div>
  );
}

export const toc = [
  { id: "overview", label: "Installation" },
  { id: "download", label: "Download" },
  { id: "usage", label: "Usage" },
  { id: "peer-deps", label: "Peer Dependencies" },
  { id: "verify", label: "Verify" },
  { id: "next-steps", label: "Next Steps" },
];
