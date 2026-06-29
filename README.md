# narrative-form

[![npm version](https://img.shields.io/npm/v/narrative-form.svg)](https://www.npmjs.com/package/narrative-form)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/narrative-form)](https://bundlephobia.com/package/narrative-form)

> A typewriter-style, appendable, single-page sign-up flow where the app types out sentence fragments and the user fills inline inputs — like completing a story.

**The app writes first:** *"My name is"* — types character by character. A blinking cursor appears, then fades into an inline input. The user fills in their answer, confirms with ↵, and the next sentence types itself below. The whole page grows like a living letter being written in real time.

---

## Install

```bash
npm install narrative-form-react narrative-form-core
```

## Quick Start

```tsx
import { NarrativeForm } from "narrative-form-react";
import "narrative-form-react/style.css";

function App() {
  return (
    <NarrativeForm
      fields={[
        { key: "name", type: "text", prefix: "My name is", placeholder: "your name" },
        { key: "email", type: "email", prefix: "You can reach me at", placeholder: "email" },
        { key: "role", type: "chips", prefix: "I am a", options: ["Developer", "Designer", "PM"] },
      ]}
      welcome={{
        heading: "Let's get to know you",
        subtext: "It'll only take a minute.",
      }}
      done={{
        message: "Thanks, {name}! We'll be in touch at {email}.",
        ctaLabel: "Submit",
        onSubmit: async (values) => {
          console.log(values);
        },
      }}
      callbacks={{
        onComplete: (values, meta) => console.log("Done!", values, meta),
      }}
    />
  );
}
```

## Features

- **Typewriter animation** — prose types character by character
- **10 field types** — text, tel, email, password, number, chips, multi-chips, select, date, otp
- **14 built-in validators** — indianPhone, aadhaar, pan, email, strongPassword, and more
- **Async validation** — with loading spinner and success tick
- **Server-driven validation** — validate against your API
- **Theming** — full CSS variable system with 25+ tokens
- **Dark mode** — `auto`, `light`, or `dark` with system detection
- **Welcome & Done screens** — animated with template variable interpolation
- **Dynamic forms** — fetch config from URL or pass pre-fetched object
- **Controlled mode** — works with Redux, Zustand, or any state manager
- **Field dependencies** — `showIf` for conditional branching
- **Step locking** — `lockPrevious` to prevent editing prior fields
- **i18n + RTL** — full internationalisation with right-to-left layout
- **Accessibility** — ARIA attributes, keyboard navigation, reduced motion
- **SSR safe** — works with Next.js App Router and Pages Router
- **Zero dependencies** — under 15KB gzipped
- **TypeScript** — full type safety with 14+ exported interfaces

## Theming

```tsx
<NarrativeForm
  theme={{
    background: "#fefefe",
    textColor: "#1a1a1a",
    fontFamily: "Georgia, serif",
    mode: "auto", // 'light' | 'dark' | 'auto'
    dark: {
      background: "#0f172a",
      textColor: "#e2e8f0",
    },
  }}
  fields={fields}
/>
```

## Validation

```tsx
{
  key: "phone",
  type: "tel",
  prefix: "My phone number is",
  validation: {
    required: true,
    use: "indianPhone", // Built-in validator
    errorDisplay: { mode: "inline+shake" },
  },
}
```

### Built-in Validators

Call `registerBuiltinValidators()` once at app startup:

```tsx
import { registerBuiltinValidators } from "narrative-form-react";
registerBuiltinValidators();
```

**India:** `indianPhone`, `indianPincode`, `aadhaar`, `pan`, `gst`, `ifsc`
**Universal:** `email`, `url`, `strongPassword`, `alphanumeric`, `noSpaces`, `futureDate`, `pastDate`, `minAge`

## Dynamic Forms

```tsx
// Fetch from server
<NarrativeForm fieldsUrl="/api/form-config" />

// Or pass pre-fetched config
<NarrativeForm formConfig={configObject} />
```

## Ref API

```tsx
const formRef = useRef<NarrativeRefHandle>(null);

<NarrativeForm formRef={formRef} fields={fields} />

// Programmatic control
formRef.current?.next();
formRef.current?.getValues();
formRef.current?.reset();
formRef.current?.focusField("email");
```

## Props

| Prop | Type | Description |
|---|---|---|
| `fields` | `NarrativeField[]` | Field configurations |
| `theme` | `NarrativeTheme` | Theme tokens |
| `typewriter` | `NarrativeTypewriter` | Animation settings |
| `welcome` | `NarrativeWelcome` | Welcome screen config |
| `done` | `NarrativeDone` | Done screen config |
| `editable` | `boolean` | Show edit icons (default: true) |
| `callbacks` | `NarrativeCallbacks` | Event callbacks |
| `formRef` | `Ref<NarrativeRefHandle>` | Imperative API |
| `defaultValues` | `NarrativeFieldValues` | Pre-fill values |
| `values` | `NarrativeFieldValues` | Controlled mode values |
| `strings` | `NarrativeI18n` | i18n overrides |
| `locale` | `string` | BCP 47 locale |
| `direction` | `'ltr' \| 'rtl'` | Text direction |
| `fieldsUrl` | `string` | Dynamic form URL |
| `formConfig` | `NarrativeFormConfig` | Pre-fetched config |
| `crossFieldValidators` | `NarrativeCrossFieldValidator[]` | Cross-field rules |
| `reducedMotion` | `boolean` | Force reduced motion |

## Browser Support

Chrome, Firefox, Safari, Edge (last 2 versions), iOS Safari 14+, Chrome Android.

## License

MIT © [Vivek Singh](https://github.com/vivekSinghInd)
