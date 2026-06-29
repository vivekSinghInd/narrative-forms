# Contributing to narrative-form

Thank you for your interest in contributing to `narrative-form`! 

## Project Structure

This is a pnpm monorepo.
- `packages/core` (`narrative-form-core`): Framework-agnostic state machine, validation engine, type definitions, and i18n strings.
- `packages/react` (`narrative-form-react`): React wrapper for the UI layer.
- `packages/vue`: (Stub) Vue wrapper.
- `packages/angular`: (Stub) Angular wrapper.
- `packages/native`: (Stub) React Native wrapper.

## Setup

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the packages:
   ```bash
   pnpm run build
   ```

## Development Guidelines

- **Zero dependencies**: `narrative-form` is designed to be lightweight. Do not add runtime dependencies (except framework peer dependencies like React).
- **TypeScript**: We use strict mode. No `any` types allowed. Use generics where necessary.
- **CSS**: The React package uses vanilla CSS with `ns-` prefixed classes and CSS variables. Do not use CSS-in-JS or utility libraries like Tailwind.
- **Tests**: Write tests for any new features or bug fixes. Run `pnpm run test` before submitting a PR.
- **Pull Requests**: Please provide a clear description of the problem and the proposed solution. Link any relevant issues.

## Releasing

We use GitHub Actions for continuous integration and publishing. When a new tag is pushed (e.g., `v1.0.1`), the publish workflow will automatically build and publish the packages to npm.
