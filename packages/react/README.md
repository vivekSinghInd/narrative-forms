# @viveksinghind/narrative-form-react

React integration for Narrative Form, a dynamic typewriter-style sign-up flow.

## Installation

```bash
npm install @viveksinghind/narrative-form-react @viveksinghind/narrative-form-core
```

## Usage

```tsx
import React from 'react';
import { NarrativeForm } from '@viveksinghind/narrative-form-react';

const myFormConfig = {
  form: { id: "test", name: "Test Form", version: 1 },
  welcome: {
    heading: "Welcome to the future",
    subtext: "Let's get started",
    ctaLabel: "Begin"
  },
  fields: [
    {
      key: "name",
      type: "text",
      prefix: "Hi, my name is",
      validation: { required: true }
    }
  ],
  done: {
    message: "All done! Thank you.",
  }
};

export default function App() {
  return (
    <NarrativeForm 
      config={myFormConfig} 
      onComplete={(values) => console.log('Form Complete!', values)} 
    />
  );
}
```

## Features
- Fully typed React components
- Smooth CSS animations for the typewriter effect
- Accessible form elements
- Themeable via config
