# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-29

### Added
- First public release of `narrative-form`.
- `narrative-form-core`: Framework-agnostic state engine, validation engine, type definitions, and internationalization strings.
- `narrative-form-react`: React wrapper providing the typewriter UI, 10 field types, theming, welcome/done screens, dynamic forms, and RTL support.
- Built-in validators for India (`indianPhone`, `aadhaar`, `pan`, etc.) and universal types (`email`, `url`, `strongPassword`, etc.).
- Async validation and server validation (`serverValidate`) with loading states.
- 5 error display modes (`inline`, `toast`, `shake`, `inline+shake`, `tooltip`).
- Deep custom theming using CSS variables (`ThemeProvider`).
- Dynamic form configuration fetching via `fieldsUrl`.
- Controlled mode via `values` and `onChange` props.
- Field dependencies (`showIf`) and step locking (`lockPrevious`).
- Full keyboard navigation and copy-paste sanitization.
- React Native entry point stub (`narrative-form-native`).
