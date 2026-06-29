# @viveksinghind/narrative-form-vue

Vue 3 implementation for Narrative Form, a dynamic typewriter-style sign-up flow.

## Installation

```bash
npm install @viveksinghind/narrative-form-vue @viveksinghind/narrative-form-core
```

## Usage

```vue
<script setup>
import { NarrativeForm } from '@viveksinghind/narrative-form-vue';

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

const handleComplete = (values) => {
  console.log('Form Complete!', values);
};
</script>

<template>
  <NarrativeForm 
    :config="myFormConfig" 
    @complete="handleComplete" 
  />
</template>
```

## Features
- Built for Vue 3 Composition API
- Uses lightweight `shallowRef` reactivity bridge
- Smooth CSS animations
- Themeable via config
