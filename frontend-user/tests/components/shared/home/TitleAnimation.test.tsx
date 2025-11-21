import React from "react";

import { render } from "@testing-library/react";

import { TitleAnimation } from "@/components/shared/home/TitleAnimation";

// Mock GSAP
jest.mock("gsap", () => ({
  gsap: {
    context: jest.fn((fn) => {
      fn();
      return { revert: jest.fn() };
    }),
    set: jest.fn(),
    to: jest.fn(),
  },
}));

describe("TitleAnimation", () => {
  it("should render with default text", () => {
    const { container } = render(<TitleAnimation />);
    expect(container.textContent).toContain(
      "Hệ thống quản lý phòng xét nghiệm"
    );
  });

  it("should render with custom text", () => {
    const customText = "Custom animation text";
    const { getByText } = render(<TitleAnimation text={customText} />);
    expect(getByText(customText)).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const customClass = "custom-class-name";
    const { container } = render(<TitleAnimation className={customClass} />);
    const element = container.querySelector(`.${customClass}`);
    expect(element).toBeInTheDocument();
  });

  it("should render without crashing with custom speed", () => {
    const { container } = render(<TitleAnimation speed={200} />);
    expect(container).toBeTruthy();
  });

  it("should handle all custom props", () => {
    const props = {
      text: "Test text",
      speed: 150,
      className: "test-class",
    };
    const { getByText } = render(<TitleAnimation {...props} />);
    expect(getByText(props.text)).toBeInTheDocument();
  });
});
