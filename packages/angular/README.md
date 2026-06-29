# @viveksinghind/narrative-form-angular

Angular integration for Narrative Form, a dynamic typewriter-style sign-up flow.

## Installation

```bash
npm install @viveksinghind/narrative-form-angular @viveksinghind/narrative-form-core
```

## Usage

```typescript
import { Component } from '@angular/core';
import { NarrativeFormComponent } from '@viveksinghind/narrative-form-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NarrativeFormComponent],
  template: `
    <narrative-form 
      [config]="myFormConfig" 
      (complete)="onComplete($event)">
    </narrative-form>
  `
})
export class AppComponent {
  myFormConfig = {
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

  onComplete(values: any) {
    console.log('Form Complete!', values);
  }
}
```

## Features
- First-class Angular standalone components
- Smooth CSS animations
- Accessible form elements
- Themeable via config
