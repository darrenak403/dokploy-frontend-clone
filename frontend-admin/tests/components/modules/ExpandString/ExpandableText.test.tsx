import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import { ExpandableText } from "@/components/modules/ExpandString/ExpandableText";

describe("ExpandableText", () => {
  it("renders N/A for null text", () => {
    render(<ExpandableText text={null} />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders N/A for undefined text", () => {
    render(<ExpandableText text={undefined} />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders N/A for empty text", () => {
    render(<ExpandableText text="" />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders N/A for whitespace only text", () => {
    render(<ExpandableText text="   " />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders full text when length <= maxLength", () => {
    render(<ExpandableText text="Short text" maxLength={20} />);
    expect(screen.getByText("Short text")).toBeInTheDocument();
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  it("renders truncated text with ellipsis when length > maxLength", () => {
    render(
      <ExpandableText
        text="This is a very long text that should be truncated"
        maxLength={20}
      />
    );
    expect(screen.getByText("This is a very long")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("expands text when clicked", () => {
    render(
      <ExpandableText
        text="This is a very long text that should be truncated"
        maxLength={20}
      />
    );
    const textElement = screen.getByRole("button");

    // Initially truncated
    expect(screen.getByText("This is a very long")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();

    // Click to expand
    fireEvent.click(textElement);

    // Now shows full text
    expect(
      screen.getByText("This is a very long text that should be truncated")
    ).toBeInTheDocument();
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  it("collapses text when clicked again", () => {
    render(
      <ExpandableText
        text="This is a very long text that should be truncated"
        maxLength={20}
      />
    );
    const textElement = screen.getByRole("button");

    // Expand first
    fireEvent.click(textElement);
    expect(
      screen.getByText("This is a very long text that should be truncated")
    ).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(textElement);
    expect(screen.getByText("This is a very long")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("handles Enter key press", () => {
    render(
      <ExpandableText
        text="This is a very long text that should be truncated"
        maxLength={20}
      />
    );
    const textElement = screen.getByRole("button");

    // Initially truncated
    expect(screen.getByText("This is a very long")).toBeInTheDocument();

    // Press Enter to expand
    fireEvent.keyDown(textElement, { key: "Enter" });
    expect(
      screen.getByText("This is a very long text that should be truncated")
    ).toBeInTheDocument();
  });

  it("handles Space key press", () => {
    render(
      <ExpandableText
        text="This is a very long text that should be truncated"
        maxLength={20}
      />
    );
    const textElement = screen.getByRole("button");

    // Initially truncated
    expect(screen.getByText("This is a very long")).toBeInTheDocument();

    // Press Space to expand
    fireEvent.keyDown(textElement, { key: " " });
    expect(
      screen.getByText("This is a very long text that should be truncated")
    ).toBeInTheDocument();
  });

  it("ignores other key presses", () => {
    render(
      <ExpandableText
        text="This is a very long text that should be truncated"
        maxLength={20}
      />
    );
    const textElement = screen.getByRole("button");

    // Initially truncated
    expect(screen.getByText("This is a very long")).toBeInTheDocument();

    // Press other key (should not expand)
    fireEvent.keyDown(textElement, { key: "A" });
    expect(screen.getByText("This is a very long")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<ExpandableText text="Test text" className="custom-class" />);
    const element = screen.getByText("Test text");
    expect(element).toHaveClass("custom-class");
  });

  it("uses custom maxLength", () => {
    render(
      <ExpandableText
        text="This is a very long text that should be truncated"
        maxLength={10}
      />
    );
    expect(screen.getByText("This is a")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("handles word boundary truncation correctly", () => {
    // Test case where truncation happens at word boundary
    render(<ExpandableText text="This is a test" maxLength={8} />);
    // Should truncate at "This is" (7 chars) instead of "This is " (8 chars)
    expect(screen.getByText("This is")).toBeInTheDocument();
  });

  it("handles text without spaces near maxLength", () => {
    render(
      <ExpandableText text="Thisisaverylongwordwithoutspaces" maxLength={10} />
    );
    // Should truncate at maxLength since no spaces found
    expect(screen.getByText("Thisisaver")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(
      <ExpandableText
        text="This is a very long text that should be truncated"
        maxLength={20}
      />
    );
    const element = screen.getByRole("button");

    expect(element).toHaveAttribute("role", "button");
    expect(element).toHaveAttribute("tabIndex", "0");
    expect(element).toHaveAttribute("aria-expanded", "false");
  });

  it("updates aria-expanded when toggled", () => {
    render(
      <ExpandableText
        text="This is a very long text that should be truncated"
        maxLength={20}
      />
    );
    const element = screen.getByRole("button");

    expect(element).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(element);
    expect(element).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(element);
    expect(element).toHaveAttribute("aria-expanded", "false");
  });
});
