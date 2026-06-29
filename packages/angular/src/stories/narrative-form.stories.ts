import { Meta, StoryObj } from '@storybook/angular';
import { NarrativeFormComponent } from '../components/narrative-form.component';

const meta: Meta<NarrativeFormComponent> = {
  title: 'Components/NarrativeForm',
  component: NarrativeFormComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<NarrativeFormComponent>;

export const Default: Story = {
  args: {
    config: {
      form: { id: 'test', name: 'Test Form', version: 1 },
      welcome: {
        heading: 'Hello there!',
        subtext: 'Welcome to the Angular form demo.',
        ctaLabel: 'Start'
      },
      fields: [
        {
          key: 'name',
          type: 'text',
          prefix: 'My name is ',
          placeholder: 'John Doe',
          validation: { required: true }
        },
        {
          key: 'age',
          type: 'number',
          prefix: 'and I am ',
          suffix: ' years old.',
          placeholder: '25',
          validation: { required: true }
        }
      ],
      done: {
        title: 'All done!',
        message: 'Thank you for filling out the form.'
      }
    }
  },
};
