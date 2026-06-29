# @viveksinghind/narrative-form-core

Core logic and state management for Narrative Form, a dynamic typewriter-style sign-up flow.

## Installation

```bash
npm install @viveksinghind/narrative-form-core
```

## Usage

This package is intended to be used as a dependency for the framework-specific packages (`react`, `vue`, `angular`, `native`). It provides the `FormStateEngine` class which manages form state, validation, and field advancement.

If you're building a custom integration for a new framework:

```ts
import { FormStateEngine } from "@viveksinghind/narrative-form-core";

const engine = new FormStateEngine(config);
engine.start();

// Subscribe to state changes
const unsubscribe = engine.subscribe((snapshot) => {
  console.log("Current state:", snapshot);
});
```

## Features
- Framework agnostic state management
- Advanced validation engine (sync & async)
- Typewriter timing engine
- Field dependency graph
