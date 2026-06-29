# CLAUDE.md — AI Assistant Instructions for narrative-form

This file instructs Claude Code and any AI coding assistant on how to work
on this project. Read this entire file before touching any code.

---

## What This Project Is

`narrative-form` is an open source React npm package.

It renders a typewriter-style, appendable, single-page sign-up flow where
the app types out sentence fragments character by character and the user
fills inline inputs — like completing a story or letter.

Full specification is in SPEC.md. Read SPEC.md before any implementation work.

---

## What This Project Is NOT

- Not a traditional form library like React Hook Form or Formik
- Not a wizard or multi-step carousel
- Not a chat or conversational UI
- Not a full app — this is a package consumed by other apps

Never add routing, pages, or app-level concerns to this package.

---

## Core Concept to Always Keep in Mind

The interaction feels like the app is writing a letter and handing the pen
to the user to complete each sentence. Every design and implementation
decision must preserve this feeling.

When in doubt about any UX or API decision, ask: does this feel like
writing a letter, or does it feel like filling a form? If it feels like
a form, it is wrong.

---

## Project Structure

```
narrative-form/
├── CLAUDE.md                  ← this file
├── SPEC.md                    ← full product specification
├── README.md                  ← npm and GitHub face
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── jest.config.ts
├── .npmignore
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── publish.yml
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
├── src/
│   ├── index.ts               ← main entry — exports everything
│   ├── NarrativeForm.tsx      ← root component
│   ├── hooks/
│   │   ├── useTypewriter.ts   ← core typewriter animation hook
│   │   ├── useValidation.ts   ← validation engine
│   │   ├── useFormState.ts    ← internal form state management
│   │   └── useDynamicForm.ts  ← fetch + parse server-driven config
│   ├── components/
│   │   ├── Line.tsx           ← single sentence row
│   │   ├── Prose.tsx          ← typewriter prose text
│   │   ├── Cursor.tsx         ← blinking cursor
│   │   ├── InlineInput.tsx    ← base inline input
│   │   ├── FilledValue.tsx    ← confirmed value + edit icon
│   │   ├── EditIcon.tsx       ← pencil svg icon
│   │   ├── EnterButton.tsx    ← ↵ confirm button
│   │   ├── ErrorMessage.tsx   ← inline error display
│   │   ├── LoadingIndicator.tsx
│   │   ├── SuccessIndicator.tsx
│   │   ├── WelcomeScreen.tsx
│   │   ├── DoneScreen.tsx
│   │   └── fields/
│   │       ├── TextField.tsx
│   │       ├── TelField.tsx
│   │       ├── EmailField.tsx
│   │       ├── PasswordField.tsx
│   │       ├── NumberField.tsx
│   │       ├── SelectField.tsx
│   │       ├── ChipsField.tsx
│   │       ├── MultiChipsField.tsx
│   │       ├── DateField.tsx
│   │       └── OtpField.tsx
│   ├── validators/
│   │   ├── registry.ts        ← registerValidator + useValidator
│   │   ├── builtins.ts        ← indianPhone, pan, gst, email, etc
│   │   └── engine.ts          ← runs rules in priority order
│   ├── theme/
│   │   ├── defaults.ts        ← default theme tokens
│   │   └── apply.ts           ← applies theme to CSS variables
│   ├── i18n/
│   │   └── strings.ts         ← default strings + merge logic
│   ├── types/
│   │   └── index.ts           ← all exported TypeScript interfaces
│   └── native/
│       └── index.ts           ← React Native entry point
├── tests/
│   ├── typewriter.test.ts
│   ├── validation.test.ts
│   ├── fields/
│   │   ├── text.test.tsx
│   │   ├── tel.test.tsx
│   │   ├── otp.test.tsx
│   │   └── ... one file per field type
│   ├── edit.test.tsx
│   ├── dynamic.test.tsx
│   ├── keyboard.test.tsx
│   ├── accessibility.test.tsx
│   └── ssr.test.tsx
├── stories/
│   ├── TextField.stories.tsx
│   ├── Validation.stories.tsx
│   ├── DynamicForm.stories.tsx
│   ├── Theming.stories.tsx
│   └── FullFlow.stories.tsx
└── docs/
    ├── API.md
    ├── VALIDATION.md
    ├── THEMING.md
    ├── DYNAMIC_FORMS.md
    ├── REACT_NATIVE.md
    └── MIGRATION.md
```

---

## Build Order

Always follow this sequence. Never skip ahead. Each step must be complete
and tested before moving to the next.

1. Project scaffold — tsup, TypeScript, package.json, folder structure
2. Core useTypewriter hook
3. Core field renderer — text type only, no validation yet
4. Append-on-confirm flow — lines grow downward
5. Edit icon flow — pencil, reopen, re-confirm
6. Validation engine — built-in rules only, sync
7. Remaining field types — tel, email, password, number
8. Chips and multi-chips
9. Select
10. OTP field
11. Error display system — all modes
12. CSS class system — ns- prefix on every element
13. Theming system — CSS variables
14. Dark mode
15. Welcome and Done screens
16. Async validation + visual states
17. Validator plugin registry + built-in library
18. Server-driven validation via URL
19. Global cross-field validation
20. Dynamic form — fieldsUrl + formConfig modes
21. Ref API — next, getValues, reset, focusField
22. Controlled mode
23. Default values / pre-fill
24. Field dependencies — showIf
25. Step locking — lockPrevious
26. Auto-advance — chips and OTP
27. Copy-paste sanitiser
28. Full keyboard navigation
29. Loading and submitting states on Done CTA
30. Network error handling + retry
31. Accessibility — aria attributes, reducedMotion
32. Internationalisation + RTL
33. React Native entry point
34. SSR safety — guard all browser APIs
35. Performance — memo, cleanup, debounce cancel
36. Full test coverage
37. Storybook stories
38. README, CHANGELOG, CONTRIBUTING, docs
39. GitHub Actions CI + publish workflow
40. npm publish v1.0.0

---

## Technical Rules — Always Follow

### General
- TypeScript strict mode is on — no `any` types, ever
- Every exported symbol must have a JSDoc comment
- No external runtime dependencies — zero
- React is a peer dependency — never import it as a direct dependency
- Bundle must stay under 10KB gzipped — check after every major addition
- `sideEffects: false` in package.json — never add side effects

### Components
- All components are functional — no class components
- Use `React.memo` on all confirmed/static line components
- Never use `useLayoutEffect` — use `useEffect` for SSR safety
- Never use `dangerouslySetInnerHTML`
- Guard all `window` and `document` access with `typeof window !== 'undefined'`
- Every component accepts a `className` prop merged with its internal ns- class

### CSS Classes
- Every element must have its `ns-` prefixed class
- Never use inline styles in the final package — CSS classes only
- State classes (--active, --error, --confirmed) are added alongside base class
- Never remove the base class when adding a state class

### Validation Engine
- Always run rules in priority order as defined in SPEC.md
- Async rules always run after all sync rules
- Cancel in-flight async requests when new input arrives
- Never call server validation if earlier sync rules already failed

### Typewriter
- Clean up setInterval on unmount — memory leak prevention
- Never retype a prefix that has already been typed — only new lines animate
- Respect `prefers-reduced-motion` — skip animation entirely if set
- Input must not appear until typewriter is fully complete

### OTP
- Each digit is a separate focusable input
- Auto-focus next box on digit entry
- Auto-focus previous box on backspace
- Paste distributes across all boxes
- Never log or expose OTP value in console

### Dynamic Forms
- Validate API response schema before rendering — never trust raw server data
- Sanitise all string values from server before rendering as text
- Show loading state while fetching config
- Show error state with retry if fetch fails
- Always call onFetchError with the error object

### Testing
- Every new feature needs tests before the PR is merged
- Test file mirrors src file — src/hooks/useTypewriter.ts → tests/typewriter.test.ts
- Use React Testing Library — never test implementation details
- Mock all network calls — never make real API calls in tests
- Test keyboard interactions using userEvent not fireEvent

---

## CSS Class Naming Reference

All classes use the `ns-` prefix. Full reference:

**Wrappers:** ns-root, ns-page, ns-header, ns-letter, ns-welcome, ns-done

**Lines:** ns-line, ns-line--active, ns-line--confirmed, ns-line--editing,
ns-line-[key] (e.g. ns-line-name)

**Prose:** ns-prose, ns-prose--typing, ns-cursor

**Input:** ns-input-wrap, ns-input, ns-input--[type], ns-input--focused,
ns-input--error, ns-input--validating, ns-input--valid, ns-enter-btn, ns-suffix

**Filled:** ns-filled-wrap, ns-filled-value, ns-edit-btn

**Chips:** ns-chips-wrap, ns-chip, ns-chip--active, ns-chip--hover

**OTP:** ns-otp-wrap, ns-otp-box, ns-otp-box--filled, ns-otp-box--active,
ns-otp-box--error, ns-otp-resend, ns-otp-resend--disabled, ns-otp-timer

**Errors:** ns-error-wrap, ns-error-text, ns-error-text--shake,
ns-loading-indicator, ns-success-indicator

**Progress:** ns-progress-wrap, ns-progress-dot, ns-progress-dot--done,
ns-progress-dot--active, ns-progress-dot--pending

**Done CTA:** ns-done-cta, ns-done-cta--loading, ns-done-cta--success,
ns-done-cta--error

**Root states:** ns-root--loading, ns-root--complete, ns-root--error,
ns-root--submitting

---

## TypeScript Exports

These interfaces must be exported from src/types/index.ts:

NarrativeField, NarrativeValidation, NarrativeValidationRule,
NarrativeTheme, NarrativeTypewriter, NarrativeWelcome, NarrativeDone,
NarrativeFormConfig, NarrativeCallbacks, NarrativeI18n,
NarrativeRefHandle, NarrativeFieldValues, NarrativeMeta

Never use `any`. Use `unknown` and narrow where needed.

---

## Validation Priority Order

Always run in this exact sequence — never change this order:

1. required
2. minLength / maxLength
3. exactLength
4. min / max
5. pattern / isEmail
6. use (plugin validators) — in array order
7. Sync custom rules — in array order
8. Async custom rules — in array order
9. serverValidate URL call
10. Global cross-field validators

If any rule fails and mode is `bail`, stop immediately. Do not run remaining rules.

---

## Built-in Validators

These ship out of the box in src/validators/builtins.ts:

**India:** indianPhone, indianPincode, aadhaar, pan, gst, ifsc
**Universal:** email, url, strongPassword, alphanumeric, noSpaces,
futureDate, pastDate, minAge

---

## Package.json Key Fields

```
name: narrative-form
main: dist/index.cjs
module: dist/index.mjs
types: dist/index.d.ts
sideEffects: false
peerDependencies: react >=17.0.0, react-dom >=17.0.0
files: [dist]
```

Exports map must include main entry and native entry.

---

## What NOT to Do

- Do not install lodash, moment, dayjs, or any utility library
- Do not install framer-motion, react-spring, or any animation library
- Do not use CSS-in-JS libraries — no styled-components, no emotion
- Do not use any component library — no MUI, no Chakra, no Radix
- Do not add `useLayoutEffect` anywhere
- Do not use `dangerouslySetInnerHTML` anywhere
- Do not add routing or navigation
- Do not add any state management library — no Redux, no Zustand
- Do not make the typewriter re-run on already-typed lines
- Do not break the ns- CSS class contract once established
- Do not rename exported TypeScript interfaces without a major version bump
- Do not add browser-only code without SSR guards
- Do not write tests that make real network calls
- Do not commit directly to main — always use a branch and PR

---

## When Adding a New Feature

1. Check SPEC.md first — is it already specified?
2. If not in spec, discuss before implementing
3. Add TypeScript types first
4. Implement the feature
5. Add ns- CSS classes to every new element
6. Write tests
7. Update relevant docs/ file
8. Add a Storybook story
9. Update CHANGELOG.md with a description of the change

---

## When Fixing a Bug

1. Write a failing test that reproduces the bug first
2. Fix the bug
3. Confirm the test passes
4. Check no other tests broke
5. Add entry to CHANGELOG.md under Fixes

---

## Commit Message Format

Use conventional commits:

- feat: add OTP field type
- fix: cursor not appearing on Safari
- docs: update validation API table
- test: add keyboard navigation tests
- chore: upgrade tsup to latest
- refactor: extract useFormState hook
- perf: memo confirmed line components

---

## Questions to Ask Before Any Implementation

Before writing any code for a new feature, ask:

1. Is this in SPEC.md?
2. Does it keep the letter-writing feeling?
3. Does it add to bundle size? Is there a zero-dependency way?
4. Does it work with SSR?
5. Does it work with React Native (or is it web-only and documented as such)?
6. Does it respect reducedMotion?
7. Does it have aria attributes?
8. Does it work keyboard-only?
9. Does it need a new ns- CSS class?
10. Does it need a new TypeScript export?

---

## Author

Vivek — Laxsarica Technologies LLP  
Package: narrative-form  
Spec version: 1.0 — June 2026
