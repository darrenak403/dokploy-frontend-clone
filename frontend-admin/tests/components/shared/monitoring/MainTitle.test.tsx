import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import MainTitle from "@/components/shared/monitoring/MainTitle";

describe("MainTitle Component", () => {
  beforeEach(() => {
    render(<MainTitle />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the main title", () => {
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Quản lí hệ thống");
  });

  it("should render the subtitle description", () => {
    const subtitle = screen.getByText(
      "Quản lý các hoạt động và sự kiện trong hệ thống"
    );
    expect(subtitle).toBeInTheDocument();
  });

  it("should apply correct styling classes", () => {
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass("text-2xl", "md:text-3xl", "font-bold");
  });

  it("should have proper semantic structure", () => {
    const container = screen.getByRole("heading", { level: 1 }).parentElement;
    expect(container).toBeInTheDocument();
  });
});
