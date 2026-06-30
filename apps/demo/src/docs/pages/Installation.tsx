import CodeBlock from "../CodeBlock";
import Callout from "../Callout";

export default function InstallationPage() {
  return (
    <div className="doc-page">
      <p className="doc-eyebrow">GUIDES</p>
      <h1 id="overview">Installation</h1>
      <p className="doc-lead">Setting up narrative-form in a React project.</p>

      <h2 id="download">Download</h2>
      <p>narrative-form is available for download on the npm registry.</p>

      <CodeBlock
        lang="terminal"
        code={`# Using npm
npm install @viveksinghind/narrative-form-react

# Using yarn
yarn add @viveksinghind/narrative-form-react

# Using pnpm
pnpm add @viveksinghind/narrative-form-react`}
      />

      <h2 id="usage">Usage</h2>
      <p>
        Import <code>NarrativeForm</code> and pass a <code>fields</code> array — each field is a
        sentence fragment plus an input, not a traditional labelled box.
      </p>

      <CodeBlock
        lang="SignUp.jsx"
        code={`import { NarrativeForm } from "@viveksinghind/narrative-form-react";

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
}`}
      />

      <h2 id="peer-deps">Peer dependencies</h2>
      <p>
        React 17 or above is required as a peer dependency. The package ships zero runtime
        dependencies of its own and stays under 10KB gzipped.
      </p>

      <Callout type="info">
        Angular, Vue, and React Native packages are in progress — see the{" "}
        <a href="https://github.com/vivekSinghInd/narrative-form" target="_blank" rel="noreferrer">
          GitHub repo
        </a>{" "}
        for roadmap status.
      </Callout>

      <h2 id="verify">Verify</h2>
      <p>
        Run your dev server and you should see the first line of your form begin typing itself
        out automatically. If nothing appears, confirm React 17+ is installed and that the
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
