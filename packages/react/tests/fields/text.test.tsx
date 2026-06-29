import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NarrativeForm } from "../../../src/NarrativeForm";
import type { NarrativeField } from "@viveksinghind/narrative-form-core";

describe("TextField", () => {
  const fields: NarrativeField[] = [
    {
      key: "firstName",
      type: "text",
      prefix: "My name is",
      placeholder: "enter name",
      animate: false,
    },
  ];

  it("renders the text field and allows typing", () => {
    render(<NarrativeForm fields={fields} welcome={{ show: false }} typewriter={{ enabled: false }} />);

    // Prefix should be visible
    expect(screen.getByText("My name is")).toBeInTheDocument();

    // Input should be present
    const input = screen.getByPlaceholderText("enter name");
    expect(input).toBeInTheDocument();

    // Type a value
    fireEvent.change(input, { target: { value: "John" } });
    expect(input).toHaveValue("John");
  });
});
