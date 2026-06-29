import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NarrativeForm } from "../src/NarrativeForm";
import type { NarrativeField } from "@viveksinghind/narrative-form-core";

const meta: Meta<typeof NarrativeForm> = {
  title: "Fields/TextField",
  component: NarrativeForm,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NarrativeForm>;

const fields: NarrativeField[] = [
  {
    key: "firstName",
    type: "text",
    prefix: "My first name is",
    placeholder: "your name",
    validation: { required: true },
  },
];

export const Default: Story = {
  args: {
    fields,
    welcome: { show: false },
    done: { show: false },
  },
};

export const WithPreFill: Story = {
  args: {
    fields,
    defaultValues: { firstName: "Vivek" },
    welcome: { show: false },
    done: { show: false },
  },
};
