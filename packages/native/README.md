# @viveksinghind/narrative-form-native

React Native components for Narrative Form, a dynamic typewriter-style sign-up flow.

## Installation

```bash
npm install @viveksinghind/narrative-form-native @viveksinghind/narrative-form-core
```

## Usage

```tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NarrativeForm } from '@viveksinghind/narrative-form-native';

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
    <SafeAreaView style={styles.container}>
      <NarrativeForm 
        config={myFormConfig} 
        onComplete={(values) => console.log('Form Complete!', values)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
```

## Features
- Fully native animations using `Animated` API
- Works seamlessly on iOS and Android
- Accessible form elements
- Themeable via config
