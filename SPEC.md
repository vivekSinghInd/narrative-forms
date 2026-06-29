# narrative-form — Complete Package Specification

**Author:** Vivek Singh
**Package Name:** `narrative-form`  
**Scoped Backup:** `@vivek/narrative-form`  
**npm Status:** Available ✅  
**License:** MIT  
**Target Bundle Size:** Under 10KB gzipped, zero dependencies  

---

## Table of Contents

1. [Concept](#concept)
2. [Package Info](#package-info)
3. [Field Types](#field-types)
4. [Field Configuration](#field-configuration)
5. [Validation](#validation)
6. [Sanitise vs Format vs Validate](#sanitise-vs-format-vs-validate)
7. [Error Display](#error-display)
8. [Typewriter Configuration](#typewriter-configuration)
9. [Edit Flow](#edit-flow)
10. [CSS Class System](#css-class-system)
11. [Theming](#theming)
12. [Dark Mode](#dark-mode)
13. [Welcome Screen](#welcome-screen)
14. [Done Screen](#done-screen)
15. [OTP Field](#otp-field)
16. [Dynamic / Server-Driven Forms](#dynamic--server-driven-forms)
17. [Database Schema](#database-schema)
18. [API Contract](#api-contract)
19. [Form Versioning](#form-versioning)
20. [Callbacks & Analytics](#callbacks--analytics)
21. [Ref API](#ref-api)
22. [Controlled vs Uncontrolled Mode](#controlled-vs-uncontrolled-mode)
23. [Default Values](#default-values)
24. [Field Dependencies](#field-dependencies)
25. [Step Locking](#step-locking)
26. [Auto Advance](#auto-advance)
27. [Copy-Paste Handling](#copy-paste-handling)
28. [Keyboard Navigation](#keyboard-navigation)
29. [Loading & Submitting States](#loading--submitting-states)
30. [Network Error Handling](#network-error-handling)
31. [Accessibility](#accessibility)
32. [Internationalisation & RTL](#internationalisation--rtl)
33. [React Native Support](#react-native-support)
34. [SSR / Next.js Safety](#ssr--nextjs-safety)
35. [TypeScript](#typescript)
36. [Build & Publish](#build--publish)
37. [Testing](#testing)
38. [Performance](#performance)
39. [Security](#security)
40. [Browser & Framework Support](#browser--framework-support)
41. [GitHub Repository Setup](#github-repository-setup)
42. [Versioning Strategy](#versioning-strategy)
43. [Demo Site](#demo-site)
44. [Storybook](#storybook)
45. [Community Launch Plan](#community-launch-plan)

---

## Concept

`narrative-form` is a typewriter-style, appendable, single-page sign-up flow where the app types out sentence fragments and the user fills inline inputs — like completing a story.

**How it feels:**
- The app writes first: *"My name is"* — types character by character
- A blinking cursor appears, then fades into an inline input
- User fills in their answer inline, within the sentence
- User confirms with ↵ — the input converts to styled filled text with an edit icon
- The next sentence types itself out below, appending to the page
- The whole page grows like a living letter being written in real time

**What it is NOT:**
- Not a traditional multi-field form
- Not a wizard / step-by-step carousel
- Not a chat / conversational UI
- Not a modal flow

**Why it is different:**
- No other package combines typewriter prose + inline mad-libs input + appendable continuation in one seamless flow
- Onboarding feels like an experience, not a gate
- Sets a premium, thoughtful brand tone before the user sees the product

---

## Package Info

| Property | Value |
|---|---|
| Package name | `narrative-form` |
| Scoped name | `@vivek/narrative-form` |
| Version | 1.0.0 |
| Author | Vivek |
| License | MIT |
| React peer dependency | ≥ 17.0.0 |
| Bundle size target | < 10KB gzipped |
| External dependencies | Zero |
| Build tool | tsup |
| Output formats | ESM + CJS + .d.ts |
| sideEffects | false (full tree shaking) |

---

## Field Types

Every field has a `type` property. Supported types:

| Type | Description |
|---|---|
| `text` | Freeform text — name, city, username |
| `tel` | Phone number — numeric keyboard on mobile |
| `email` | Email address — email keyboard on mobile |
| `password` | Masked input — toggle show/hide |
| `number` | Numeric only — age, pincode, amount |
| `select` | Inline dropdown |
| `chips` | Tap to select one option |
| `multi-chips` | Tap to select multiple options |
| `date` | Inline date picker |
| `otp` | N-digit OTP boxes — see OTP section |

---

## Field Configuration

Every field in the `fields` array accepts the following properties:

### Identity
| Property | Type | Required | Description |
|---|---|---|---|
| `key` | string | ✅ | Unique identifier e.g. `"name"` |
| `type` | string | ✅ | One of the supported field types |
| `prefix` | string | ✅ | Sentence text before the input e.g. `"My name is"` |
| `suffix` | string | ❌ | Sentence text after the input e.g. `"years old"` |
| `placeholder` | string | ❌ | Ghost text inside the input |
| `order` | number | ❌ | Sequence of field — used in dynamic/DB mode |
| `options` | string[] | ❌ | For chips / select / multi-chips |
| `animate` | boolean | ❌ | Whether this line uses typewriter — default true |
| `autoAdvance` | boolean | ❌ | Auto-confirm on fill — for chips and OTP |
| `lockPrevious` | boolean | ❌ | Once this field shows, previous fields not editable |
| `showIf` | function | ❌ | Conditional display — see Field Dependencies |
| `className` | string | ❌ | Extra CSS class on the line wrapper |
| `inputClassName` | string | ❌ | Extra CSS class on the input element |
| `editable` | boolean | ❌ | Override global editable per field — default true |
| `defaultValue` | string | ❌ | Pre-filled value — skips typewriter, shows as confirmed |

---

## Validation

### Built-in Rules Per Field

| Rule | Type | Description |
|---|---|---|
| `required` | boolean | Field must be filled |
| `requiredMessage` | string | Custom message for required |
| `minLength` | number | Minimum character count |
| `minLengthMessage` | string | Custom message |
| `maxLength` | number | Maximum character count |
| `maxLengthMessage` | string | Custom message |
| `exactLength` | number | Must be exactly N characters |
| `exactLengthMessage` | string | Custom message |
| `pattern` | RegExp | Must match regex |
| `patternMessage` | string | Custom message |
| `isEmail` | boolean | Must be valid email format |
| `isEmailMessage` | string | Custom message |
| `min` | number | Minimum value (for number type) |
| `minMessage` | string | Custom message |
| `max` | number | Maximum value (for number type) |
| `maxMessage` | string | Custom message |

### Custom Validator — Single Function

A function that receives `(value, allValues)` and returns `true` on pass or an error string on fail. Supports both sync and async.

- `value` — current field value
- `allValues` — all confirmed field values so far — enables cross-field checks

### Multiple Rules Array

A field can have multiple named custom rules, each with its own validate function and message. Rules run in array order.

| Property | Type | Description |
|---|---|---|
| `name` | string | Rule identifier |
| `validate` | function | Sync or async function returning true or error string |
| `message` | string | Fallback message if validate returns false |
| `async` | boolean | Mark as async — runs after all sync rules |
| `debounce` | number | Milliseconds to debounce before firing |

### Validation Mode

| Value | Behaviour |
|---|---|
| `bail` | Stop at first failure — default |
| `all` | Run all rules and collect all errors |

### Validation Trigger

| Value | When it fires |
|---|---|
| `onChange` | Every keystroke |
| `onBlur` | When user leaves the field |
| `onSubmit` | When user presses ↵ |
| `onConfirm` | Same as onSubmit |
| `debounced` | N milliseconds after typing stops |

`debounceMs` — time in milliseconds — used with `debounced` trigger.

### Validation Priority Order

Rules always run in this sequence:

1. required
2. minLength / maxLength
3. exactLength
4. min / max
5. pattern / isEmail
6. use (registered plugin validators) — in array order
7. Sync custom rules — in array order
8. Async custom rules — in array order
9. Server validation (serverValidate URL)
10. Global cross-field validators

Async always runs last to avoid unnecessary API calls when earlier rules already fail.

### Global Cross-Field Validation

Validates across multiple fields simultaneously. Defined at root component level, not per field. Each global rule specifies which fields it watches and which field displays the error.

### Server-Driven Validation

Validation rules can be fetched from a URL — no hardcoding needed. The package calls the endpoint, reads the response using `responsePath` for pass/fail and `errorPath` for the error message.

Supports custom headers, request body with field value and other confirmed values injected via template strings, debounce, and timeout.

### Validator Plugin / Registry System

Developers register reusable named validators globally once at app level. Any field can then reference them by name via the `use` property — either a single string or array of strings.

### Built-in Validator Library

Shipped out of the box — no setup needed:

**India-specific:**
- `indianPhone` — starts 6–9, 10 digits
- `indianPincode` — 6 digits
- `aadhaar` — 12 digits
- `pan` — format ABCDE1234F
- `gst` — GST number format
- `ifsc` — Bank IFSC code format

**Universal:**
- `email` — valid email
- `url` — valid URL
- `strongPassword` — min 8 chars, upper, lower, number, special character
- `alphanumeric` — letters and numbers only
- `noSpaces` — no whitespace
- `futureDate` — date must be in future
- `pastDate` — date must be in past
- `minAge` — calculated from date field

### Async Validation Visual States

| State | What shows |
|---|---|
| idle | Nothing |
| validating | Spinner next to input + optional loading text |
| valid | Optional ✓ tick + optional success text |
| invalid | Error message appears |

---

## Sanitise vs Format vs Validate

These are three distinct operations applied in sequence — never conflated:

| Operation | What it does | Visible to user? | Shows error? |
|---|---|---|---|
| `sanitise` | Transforms raw input silently | No — transforms before display | No |
| `format` | Displays value formatted, stores raw | Yes — display only | No |
| `validate` | Checks the sanitised value | No | Yes on failure |

Example for phone: sanitise strips non-digits and +91 prefix → format adds a space after 5 digits for display → validate checks it is exactly 10 digits.

---

## Error Display

| Property | Options | Description |
|---|---|---|
| `mode` | `inline` `toast` `shake` `inline+shake` `tooltip` | How error appears |
| `position` | `below` `above` | For inline mode |
| `icon` | boolean | Show ⚠ icon before message |
| `iconChar` | string | Custom icon character |
| `animateIn` | `fadeUp` `slideDown` `none` | Entry animation |
| `clearOn` | `onChange` `onFocus` | When error disappears |

Error text always stays in the editorial tone — small, muted, italic — consistent with the letter aesthetic.

---

## Typewriter Configuration

Controls the typewriter animation for the prose prefix of each line.

| Property | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | true | Turn off globally — useful for accessibility |
| `speed` | number | 38 | Milliseconds per character |
| `cursor` | boolean | true | Show blinking cursor while typing |
| `cursorChar` | string | `\|` | Customise cursor character |
| `pauseAfter` | number | 100 | Milliseconds pause after typing before input appears |
| `animate` | boolean | true | Per-field override on field config |

When a field is edited, the prefix does not retype — only new lines type out on first appearance.

---

## Edit Flow

Once a field is confirmed, a small pencil edit icon appears inline next to the filled text.

| Property | Type | Description |
|---|---|---|
| `editable` | boolean | Show edit icon globally — default true |
| `editIcon` | string or JSX | `pencil` or `text` ("Edit") or custom JSX |
| `collapseOnEdit` | boolean | Collapse lines below when a field is edited |
| `onEdit` | function | Callback when user taps edit icon |

**Behaviour when editing:**
- Filled text converts back to input, pre-filled with current value
- Edit icon disappears
- Lines below remain visible unless `collapseOnEdit` is true
- Exception: editing role collapses the Done screen since it depends on role
- Confirming again restores the filled state and edit icon

---

## CSS Class System

All classes are prefixed `ns-` to avoid conflicts with any other library.

### Wrapper & Layout
| Class | Element |
|---|---|
| `ns-root` | Outermost wrapper |
| `ns-page` | Mobile page container |
| `ns-header` | Top header area |
| `ns-letter` | The growing letter container |

### Welcome Screen
| Class | Element |
|---|---|
| `ns-welcome` | Welcome screen wrapper |
| `ns-welcome-heading` | Heading text |
| `ns-welcome-subtext` | Subtext paragraph |
| `ns-welcome-cta` | Let's go button |

### Per Line
| Class | Element |
|---|---|
| `ns-line` | Each sentence row |
| `ns-line--active` | Line currently being filled |
| `ns-line--confirmed` | Line that has been confirmed |
| `ns-line--editing` | Line in edit mode |
| `ns-line-[key]` | e.g. `ns-line-name`, `ns-line-phone` |

### Prose & Typewriter
| Class | Element |
|---|---|
| `ns-prose` | The sentence text |
| `ns-prose--typing` | While typewriter is running |
| `ns-cursor` | Blinking cursor character |

### Input
| Class | Element |
|---|---|
| `ns-input-wrap` | Wraps input and enter button |
| `ns-input` | The actual input element |
| `ns-input--text` | Type variant |
| `ns-input--tel` | Type variant |
| `ns-input--email` | Type variant |
| `ns-input--password` | Type variant |
| `ns-input--number` | Type variant |
| `ns-input--focused` | Input is focused |
| `ns-input--error` | Validation failed |
| `ns-input--validating` | Async validation running |
| `ns-input--valid` | Async validation passed |
| `ns-enter-btn` | The ↵ confirm button |
| `ns-suffix` | Text after the input |

### Filled / Confirmed Value
| Class | Element |
|---|---|
| `ns-filled-wrap` | Wraps filled text and edit icon |
| `ns-filled-value` | The confirmed italic text |
| `ns-edit-btn` | Pencil edit icon button |

### Chips & Select
| Class | Element |
|---|---|
| `ns-chips-wrap` | Wraps all chips |
| `ns-chip` | Individual chip |
| `ns-chip--active` | Selected chip |
| `ns-chip--hover` | Hovered chip |
| `ns-select-wrap` | Inline select wrapper |
| `ns-select` | The select element |

### OTP
| Class | Element |
|---|---|
| `ns-otp-wrap` | Wraps all OTP boxes |
| `ns-otp-box` | Individual digit box |
| `ns-otp-box--filled` | Digit entered |
| `ns-otp-box--active` | Currently focused |
| `ns-otp-box--error` | Wrong OTP |
| `ns-otp-resend` | Resend link |
| `ns-otp-resend--disabled` | During countdown |
| `ns-otp-timer` | Countdown text |

### Validation & Errors
| Class | Element |
|---|---|
| `ns-error-wrap` | Error message container |
| `ns-error-text` | The error message |
| `ns-error-text--shake` | Shake animation variant |
| `ns-loading-indicator` | Async validation spinner |
| `ns-success-indicator` | Async validation tick |

### Progress
| Class | Element |
|---|---|
| `ns-progress-wrap` | Dots container |
| `ns-progress-dot` | Individual dot |
| `ns-progress-dot--done` | Completed |
| `ns-progress-dot--active` | Current |
| `ns-progress-dot--pending` | Not yet reached |

### Done Screen
| Class | Element |
|---|---|
| `ns-done` | Done section wrapper |
| `ns-done-message` | Done message text |
| `ns-done-cta` | Submit / OTP button |
| `ns-done-cta--loading` | Button in loading state |
| `ns-done-cta--success` | Button in success state |
| `ns-done-cta--error` | Button in error state |

### Root State Classes
| Class | When applied |
|---|---|
| `ns-root--loading` | While async validation runs |
| `ns-root--complete` | All fields confirmed |
| `ns-root--error` | Any field has an active error |
| `ns-root--submitting` | Done CTA tapped, awaiting response |

### Per-Field className Override
Each field config accepts `className` (added to the line wrapper) and `inputClassName` (added to the input element). The root component accepts a `className` prop added to `ns-root`.

---

## Theming

All theme properties passed via the `theme` prop. Every property is optional — unset properties fall back to defaults.

### Colors
| Token | Description |
|---|---|
| `background` | Page background |
| `textColor` | Prose and filled value color |
| `inputBorderColor` | Input underline color |
| `placeholderColor` | Input placeholder text |
| `errorColor` | Error message and shake color |
| `filledColor` | Confirmed value text color |
| `cursorColor` | Typewriter cursor color |
| `successColor` | Async validation success tick |
| `loadingColor` | Async validation spinner |

### Typography
| Token | Description |
|---|---|
| `fontFamily` | Serif prose font |
| `uiFontFamily` | Sans-serif UI font for buttons and labels |
| `fontSize` | Base prose font size |
| `mobileFontSize` | Font size on small screens |
| `inputFontStyle` | Default italic — customisable |

### Spacing
| Token | Description |
|---|---|
| `lineGap` | Gap between each line/sentence |
| `pagePadding` | Inner padding of the page container |

### Buttons
| Token | Description |
|---|---|
| `buttonRadius` | Border radius of confirm and CTA buttons |
| `buttonBackground` | Button background color |
| `buttonColor` | Button text color |
| `enterBtnSize` | Size of the ↵ button |

### Chips
| Token | Description |
|---|---|
| `chipBorderRadius` | Border radius — default 100px (pill) |
| `chipBorderColor` | Unselected chip border |
| `chipActiveBackground` | Selected chip background |
| `chipActiveColor` | Selected chip text color |
| `chipFontStyle` | Default italic |

---

## Dark Mode

| Property | Options | Description |
|---|---|---|
| `mode` | `light` `dark` `auto` | Auto detects system preference |

Dark theme accepts same tokens as light theme nested under `dark` key in the theme object.

---

## Welcome Screen

Configurable via the `welcome` prop.

| Property | Type | Description |
|---|---|---|
| `show` | boolean | Show or skip welcome screen — default true |
| `heading` | string | Main heading text |
| `subtext` | string | Supporting paragraph |
| `ctaLabel` | string | Button label — default "Let's go →" |

---

## Done Screen

Configurable via the `done` prop.

| Property | Type | Description |
|---|---|---|
| `show` | boolean | Show done section — default true |
| `message` | string or function | Static string or function receiving all values |
| `ctaLabel` | string | Button label — default "Continue →" |
| `onSubmit` | function | Called when CTA is tapped — receives all values |

Template variables supported in message string — e.g. `"That's all we need, {name}."` — `{key}` is replaced with confirmed field value.

---

## OTP Field

Special field type with its own configuration:

| Property | Type | Description |
|---|---|---|
| `otpLength` | number | Number of digit boxes — default 6 |
| `onRequest` | function | Called when field appears — triggers OTP send |
| `onVerify` | function | Called when all digits filled — receives OTP string |
| `resendLabel` | string | Label for resend link |
| `resendDelay` | number | Seconds before resend is allowed — default 30 |
| `autoAdvance` | boolean | Auto-submit when all digits filled — default true |

Each digit box is a separate focusable element. Focus auto-advances on each digit entry. Backspace moves focus back. Paste fills all boxes automatically.

---

## Dynamic / Server-Driven Forms

The entire form config can be fetched from a server. Three modes supported:

### Mode 1 — URL (package fetches itself)

Pass a `fieldsUrl` prop. The package fetches the config on mount, shows a loading state, then renders the form. Supports custom headers for auth.

| Property | Type | Description |
|---|---|---|
| `fieldsUrl` | string | API endpoint returning form config JSON |
| `fieldsUrlHeaders` | object | Headers — e.g. Authorization token |
| `onFetchError` | function | Called if fetch fails |
| `loadingComponent` | JSX | Custom loader while fetching config |
| `errorComponent` | JSX | Custom UI if config fetch fails |
| `retryLabel` | string | Label for retry button on fetch error |

### Mode 2 — Pre-fetched Config Object

Pass a `formConfig` prop with the already-fetched config object. Developer controls the fetch.

### Mode 3 — Static Fields Array

Pass a `fields` prop directly. Same as always. No server involved.

All three modes produce identical UI and behaviour.

---

## Database Schema

For storing and serving form configs dynamically.

### forms table
Stores each form definition.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR | Identifier e.g. `investor_signup` |
| description | VARCHAR | Human-readable description |
| is_active | BOOLEAN | Enable / disable form |
| version | INTEGER | Increments on every change |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### form_fields table
Stores each field belonging to a form.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| form_id | UUID | Foreign key to forms |
| key | VARCHAR | Field identifier |
| prefix | VARCHAR | Sentence text before input |
| suffix | VARCHAR | Sentence text after input — nullable |
| type | VARCHAR | Field type |
| placeholder | VARCHAR | Input placeholder |
| order | INTEGER | Display sequence |
| is_required | BOOLEAN | Required flag |
| is_active | BOOLEAN | Enable / disable field |
| show_if | JSONB | Conditional display rule |
| options | JSONB | Array of options for chips / select |
| validation | JSONB | Full validation config object |
| animate | BOOLEAN | Typewriter on this line |
| auto_advance | BOOLEAN | Auto-confirm on fill |
| default_value | VARCHAR | Pre-filled value |
| created_at | TIMESTAMP | |

### form_themes table
Stores theme config per form.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| form_id | UUID | Foreign key to forms |
| background | VARCHAR | |
| text_color | VARCHAR | |
| font_family | VARCHAR | |
| — | — | All other theme tokens |

---

## API Contract

The endpoint must return JSON in this exact shape:

### Response Object

**form** — metadata: id, name, version

**welcome** — heading, subtext, ctaLabel

**fields** — array of field objects. Each field object matches the Field Configuration section exactly. All properties serialised as JSON.

**theme** — theme token object matching the Theming section.

**done** — message template string, ctaLabel.

The package validates the response schema before rendering. If required properties are missing, `onFetchError` is called with a schema validation error.

All string values in prefix, suffix, placeholder, and options are sanitised server-side before serving. Never serve raw user-generated content in these fields without sanitisation.

---

## Form Versioning

Every `onComplete` callback receives a `meta` object alongside the field values:

| Property | Description |
|---|---|
| `formId` | UUID of the form |
| `formVersion` | Version number of the form that was filled |
| `totalTimeMs` | Total milliseconds from welcome screen to completion |
| `fieldTimings` | Object with timeSpentMs per field key |

This enables A/B testing — compare completion rates and timings between form versions. Store version with every submission in your backend.

---

## Callbacks & Analytics

| Callback | Arguments | When it fires |
|---|---|---|
| `onChange` | `(key, value)` | Every keystroke in any field |
| `onFieldFocus` | `(key)` | Field input is focused |
| `onFieldBlur` | `(key, value)` | Field input loses focus |
| `onFieldComplete` | `(key, value, timeSpentMs)` | Field is confirmed |
| `onEdit` | `(key)` | Edit icon tapped |
| `onError` | `(key, message)` | Validation failure |
| `onDropOff` | `(lastFieldKey)` | User leaves page without completing |
| `onComplete` | `(allValues, meta)` | All fields confirmed — see Form Versioning for meta shape |

`timeSpentMs` per field is measured from when the field's input first appeared to when the user confirmed it. Useful for identifying friction points in the flow.

`onDropOff` fires on page `visibilitychange` or `beforeunload` if the form is not yet complete. Sends the key of the last field that was active.

---

## Ref API

Attach a ref to the component for programmatic control.

| Method | Description |
|---|---|
| `next()` | Programmatically confirm current field and advance |
| `getValues()` | Returns object of all currently confirmed values |
| `reset()` | Resets entire form to initial state |
| `focusField(key)` | Jumps focus to a specific field by key |

---

## Controlled vs Uncontrolled Mode

### Uncontrolled (default)
The package manages all state internally. Developer receives values via callbacks.

### Controlled
Developer manages state externally — compatible with Redux, Zustand, React Hook Form, or any state manager.

Pass `values` object with current values and `onChange` callback. The package treats these as the source of truth and does not maintain internal state for field values.

---

## Default Values

Pass `defaultValues` object with pre-filled values at root level.

Fields with a matching default value are shown as already confirmed — filled text with edit icon visible. Typewriter animation is skipped for pre-filled fields. All subsequent fields still animate normally.

Useful for editing an existing profile, resuming a partially completed signup, or pre-filling known data from OAuth.

---

## Field Dependencies

Each field accepts a `showIf` function receiving the current `allValues` object. The field only appears when the function returns true.

This enables branching flows — show different fields based on earlier answers — without any logic in the parent component.

`showIf` is re-evaluated whenever any field value changes. Fields that become hidden after being confirmed are removed from `getValues()` output.

---

## Step Locking

Each field accepts `lockPrevious` boolean. When true, all fields that appeared before this field become non-editable once this field is shown. Edit icons are hidden on locked fields.

Useful for OTP fields — once the OTP screen appears, phone number should not be editable.

---

## Auto Advance

Fields with `autoAdvance: true` automatically confirm without requiring the user to press ↵.

- `chips` — tapping a chip instantly confirms the field
- `multi-chips` — does not auto-advance (requires explicit confirm since multiple can be selected)
- `otp` — auto-submits when all digit boxes are filled
- `select` — auto-advances on selection

---

## Copy-Paste Handling

Each field accepts a `sanitise` function applied on paste events as well as on change.

For `tel` fields — built-in paste sanitiser strips spaces, dashes, brackets, and `+91` / `0` prefix automatically, leaving only the 10-digit number.

For `otp` fields — pasting a full OTP string automatically distributes digits across all boxes.

For `password` fields — paste is allowed by default. Can be disabled via `allowPaste: false`.

---

## Keyboard Navigation

Full keyboard-only operation supported:

| Key | Action |
|---|---|
| Enter / Return | Confirm current field |
| Tab | Move focus to next interactive element |
| Escape | Cancel edit mode — revert to last confirmed value |
| Backspace (on empty input) | Optional — move focus to previous field |
| Arrow Left / Right | Navigate between chips |
| Arrow Up / Down | Navigate select options |
| Space | Select focused chip |

All interactions are operable without a mouse or touch screen.

---

## Loading & Submitting States

The Done CTA button has four visual states:

| State | What shows |
|---|---|
| default | Normal button label |
| loading | Spinner replaces label, button disabled |
| success | Tick icon, optional success label, button disabled |
| error | Error message appears below button, button re-enabled for retry |

States are controlled via the `onSubmit` prop — developer resolves or rejects a promise and the package handles the visual transition.

---

## Network Error Handling

For async validation and OTP:

| Property | Type | Description |
|---|---|---|
| `timeout` | number | Milliseconds before request is aborted |
| `timeoutMessage` | string | Message shown on timeout |
| `retryable` | boolean | Show retry option on network failure |
| `retryLabel` | string | Label for retry action |

If the config fetch fails (`fieldsUrl` mode), an error state is shown with an optional retry button. `onFetchError` is called with the error.

---

## Accessibility

| Property | Type | Description |
|---|---|---|
| `reducedMotion` | boolean | Auto-detected via `prefers-reduced-motion` media query — typewriter and animations disabled |
| `ariaLabels` | object | Map of field key to aria-label string |

Every input element has an associated accessible label derived from its prefix text. The typewriter output is placed in an `aria-live` region so screen readers announce it. All interactive elements are reachable via keyboard. Focus management is handled automatically as new lines appear.

---

## Internationalisation & RTL

| Property | Options | Description |
|---|---|---|
| `locale` | string | BCP 47 locale code e.g. `en`, `hi`, `ar` |
| `direction` | `ltr` `rtl` | Text direction — auto-detected from locale if not set |

### i18n Strings

All default UI strings are overridable via the `strings` prop:

| Key | Default |
|---|---|
| `editLabel` | Edit |
| `requiredMessage` | This field is required |
| `otpResend` | Resend OTP |
| `otpTimer` | Resend in {seconds}s |
| `submitLabel` | Continue |
| `loadingLabel` | Please wait… |
| `successLabel` | Done |
| `retryLabel` | Try again |
| `fetchErrorMessage` | Could not load form |

In RTL mode, the layout mirrors automatically — prefix text aligns right, input extends left, edit icon appears on the opposite side.

---

## React Native Support

A separate entry point `narrative-form/native` exports a React Native compatible version.

Web primitives (`div`, `input`, `button`, `span`) are replaced with React Native equivalents (`View`, `TextInput`, `TouchableOpacity`, `Text`). The typewriter hook, validation engine, and all configuration props are identical to the web version.

`inputMode` and `returnKeyType` are set appropriately per field type. Keyboard avoiding behaviour is handled via `KeyboardAvoidingView`.

Clearly documented in README which props are web-only and which are RN-compatible.

---

## SSR / Next.js Safety

All browser APIs (`window`, `document`, `localStorage`) are guarded with `typeof window !== 'undefined'` checks.

The typewriter animation and focus management only run on the client. The component renders a static skeleton on the server — matching HTML structure with no animation state.

README includes the recommended usage pattern for Next.js App Router and Pages Router.

No `useLayoutEffect` used — replaced with `useEffect` for SSR compatibility.

---

## TypeScript

Full TypeScript support shipped natively. No DefinitelyTyped dependency needed.

All interfaces are exported for developer use:

| Export | Description |
|---|---|
| `NarrativeField` | Single field config |
| `NarrativeValidation` | Validation config |
| `NarrativeValidationRule` | Single rule in rules array |
| `NarrativeTheme` | Theme token object |
| `NarrativeTypewriter` | Typewriter config |
| `NarrativeWelcome` | Welcome screen config |
| `NarrativeDone` | Done screen config |
| `NarrativeFormConfig` | Full form config (used in dynamic mode) |
| `NarrativeCallbacks` | All callback function signatures |
| `NarrativeI18n` | i18n strings object |
| `NarrativeRefHandle` | Ref API method signatures |
| `NarrativeFieldValues` | Record of key to value for completed form |
| `NarrativeMeta` | Meta object returned in onComplete |

---

## Build & Publish

| Property | Value |
|---|---|
| Build tool | tsup |
| Output — ESM | dist/index.mjs |
| Output — CJS | dist/index.cjs |
| Output — Types | dist/index.d.ts |
| React Native entry | dist/native/index.mjs |
| Source maps | Yes |
| sideEffects | false |
| React | Peer dependency — not bundled |
| External dependencies | Zero — nothing bundled |

### package.json exports map
Named exports for main entry, native entry, and CSS classes reference. Tree-shaking friendly — developers who import only specific utilities do not pay for the full bundle.

### .npmignore
Excludes: src, tests, stories, demo, config files, GitHub Actions — only dist ships to npm.

---

## Testing

| Layer | Tool |
|---|---|
| Unit tests | Jest + React Testing Library |
| Component tests | RTL — render, interact, assert |
| Accessibility tests | jest-axe |
| TypeScript types | tsd |

### Test Coverage Required

- Each field type renders correctly
- Typewriter completes and input appears
- Each validation rule fires with correct message
- Async validation shows loading then result
- Edit flow opens and re-confirms correctly
- onComplete fires with correct values and meta
- onDropOff fires when page is left incomplete
- Keyboard navigation works end to end
- RTL layout renders correctly
- reducedMotion skips animation
- defaultValues pre-fill and skip animation
- showIf hides and shows fields correctly
- lockPrevious disables edit on prior fields
- Dynamic fetch — loading, success, error states
- OTP — digit entry, auto-advance, resend countdown
- SSR — component renders without window errors

---

## Performance

- All confirmed lines are memoised — do not re-render on subsequent field changes
- Typewriter uses `setInterval` with proper cleanup on unmount
- Debounced async validators cancel in-flight requests on new input
- Zero dependencies — no moment.js, lodash, or animation library
- `sideEffects: false` in package.json enables full tree shaking

---

## Security

- No `eval` or `dangerouslySetInnerHTML` anywhere in the package
- All values passed to callbacks are raw strings — no HTML
- Server-driven config: prefix, suffix, placeholder, and options strings must be sanitised server-side before serving
- Async validation URLs — only developer-provided URLs are called, never user-provided values
- OTP values — never logged or exposed in callbacks beyond `onVerify`
- Copy-paste sanitiser strips potentially malicious content from inputs

---

## Browser & Framework Support

### Browsers
| Browser | Version |
|---|---|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| iOS Safari | 14+ |
| Chrome Android | Last 2 versions |

### Frameworks
| Framework | Support |
|---|---|
| React | ≥ 17 |
| Next.js | ≥ 13 (App Router + Pages Router) |
| Remix | ✅ |
| Vite + React | ✅ |
| Create React App | ✅ |
| React Native + Expo | ✅ (native entry) |
| Angular | Planned v2 |

---

## GitHub Repository Setup

### Files Required at Root
| File | Purpose |
|---|---|
| README.md | Install instructions, live demo GIF, full API table, badges |
| CHANGELOG.md | Version history — updated on every release |
| CONTRIBUTING.md | How to contribute, local dev setup, PR guidelines |
| CODE_OF_CONDUCT.md | Community standards |
| LICENSE | MIT |
| .npmignore | Exclude src, tests, stories, demo from published package |

### README Must Include
- Animated GIF of the interaction
- One-line install command
- Minimal usage example
- Full props API table
- Link to live demo site
- Bundle size badge (Bundlephobia)
- npm version badge
- License badge
- TypeScript badge

### GitHub Actions CI
- On every pull request: run tests, type check, build
- On every version tag: run tests, build, publish to npm automatically
- Lint check on every push

### Issue Templates
- Bug report — with reproduction steps and expected vs actual behaviour
- Feature request — with use case description
- Question — redirect to Discussions

---

## Versioning Strategy

Follows Semantic Versioning (semver) strictly.

| Change type | Version bump |
|---|---|
| Bug fix, internal change | PATCH — 1.0.x |
| New prop, new field type, backward compatible | MINOR — 1.x.0 |
| Breaking prop rename, removed feature | MAJOR — x.0.0 |

Use **Changesets** for version management — developers document their change in a changeset file, CI bumps version and updates CHANGELOG automatically on merge.

Breaking changes must include a migration guide in CHANGELOG and ideally a codemod script.

Never deprecate without at least one MINOR version of warning with console.warn.

---

## Demo Site

The demo site is the primary marketing asset — more important than the README.

### Must Have
| Feature | Description |
|---|---|
| Live playground | Interactive form running in browser — try it instantly |
| Code preview panel | Shows exact JSX config that produces the current demo |
| Copy to clipboard | One click to copy the config |
| Theme switcher | Toggle light / dark / custom theme live |
| Field builder | Add, remove, reorder fields visually — generates config |
| Shareable URL | Encode current config in URL — `/demo?config=...` — shareable link |
| Preset examples | Investor signup, checkout, survey, profile edit — one-click load |

### Stack
Deployed on Vercel. Domain: `narrative-form.dev` or similar.

---

## Storybook

Stories required for:
- Each field type in isolation
- Each validation scenario — required, pattern, async, server
- Each error display mode
- Light theme vs dark theme
- RTL layout
- Reduced motion
- Controlled mode
- Pre-filled defaultValues
- Dynamic form with mocked fetch
- Full end-to-end flow

Storybook is deployed publicly and linked from README. Gets indexed by Google — organic discovery channel.

---

## Community Launch Plan

### Pre-Launch
- Record a clean screen recording of the full interaction — name, phone, role, done
- Create a GIF from the recording for README and social posts
- Register on Product Hunt — schedule launch
- Write a Dev.to article: "I built a new kind of sign-up form — here's why"

### Launch Day
- Product Hunt launch
- Post GIF + 2-line description on Twitter / X — tag react, javascript communities
- Post on LinkedIn with the thinking behind it
- Post on r/reactjs and r/webdev with the demo link
- Post on relevant Discord servers — Reactiflux, Frontend Horse

### Post-Launch
- Write a Hashnode deep-dive on the implementation
- Pitch to CSS-Tricks and Smashing Magazine
- Answer Stack Overflow questions about custom sign-up flows — link to package
- Reach out to newsletters — JavaScript Weekly, React Status, TLDR

### Credit Protection
- GitHub repo creation date is your public timestamp
- npm publish date is your second timestamp
- Dev.to and LinkedIn posts create additional dated public records

---

## Build Order

When development begins, build in this sequence:

1. Project scaffold — tsup, TypeScript, package.json, folder structure
2. Core typewriter hook
3. Core field renderer — text type only
4. Append-on-confirm flow
5. Edit icon flow
6. Validation engine — built-in rules
7. Remaining field types — tel, email, password, number
8. Chips and multi-chips
9. Select
10. OTP field
11. Error display system
12. CSS class system
13. Theming system
14. Dark mode
15. Welcome and Done screens
16. Async validation + visual states
17. Validator plugin registry + built-in library
18. Server-driven validation
19. Global cross-field validation
20. Dynamic form — fieldsUrl + formConfig modes
21. Ref API
22. Controlled mode
23. Default values
24. Field dependencies — showIf
25. Step locking
26. Auto-advance
27. Copy-paste sanitiser
28. Full keyboard navigation
29. Loading and submitting states
30. Network error handling
31. Accessibility — aria, reducedMotion
32. i18n + RTL
33. React Native entry point
34. SSR safety
35. Performance — memo, cleanup
36. Testing — full coverage
37. Storybook
38. README, CHANGELOG, CONTRIBUTING
39. GitHub Actions CI
40. npm publish v1.0.0
41. Demo site
42. Community launch

---

*Spec version 1.0 — June 2026*  
*Author: Vivek, Laxsarica Technologies LLP*
