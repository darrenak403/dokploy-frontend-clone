/**
 * @jest-environment jsdom
 */
import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Footer } from "@/components/shared/layout/Footer";

// Mock HeroUI components
jest.mock("@heroui/react", () => ({
  Input: ({
    placeholder,
    className,
  }: {
    placeholder?: string;
    className?: string;
  }) => (
    <input
      placeholder={placeholder}
      className={className}
      data-testid="email-input"
    />
  ),
  Button: ({
    children,
    onClick,
    isIconOnly,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    isIconOnly?: boolean;
  }) => (
    <button
      onClick={onClick}
      data-icon-only={isIconOnly}
      data-testid="subscribe-button"
    >
      {children}
    </button>
  ),
  Link: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock Iconify
jest.mock("@iconify/react", () => ({
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid={`icon-${icon}`}>Icon</span>
  ),
}));

describe("Footer Component", () => {
  it("should render the brand name", () => {
    render(<Footer />);
    expect(screen.getByText("LABMS")).toBeInTheDocument();
  });

  it("should render newsletter subscription section", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Đăng kí nhận bản tin của chúng tôi/i)
    ).toBeInTheDocument();
  });

  it("should render email input field", () => {
    render(<Footer />);
    const emailInput = screen.getByTestId("email-input");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("placeholder", "Your email address");
  });

  it("should render subscribe button", () => {
    render(<Footer />);
    const subscribeButton = screen.getByTestId("subscribe-button");
    expect(subscribeButton).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<Footer />);

    // Check for common footer links
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("should have correct styling classes", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");

    expect(footer).toHaveClass("bg-white");
    expect(footer).toHaveClass("dark:bg-slate-900");
  });

  it("should render brand with correct font class", () => {
    render(<Footer />);
    const brandElement = screen.getByText("LABMS");
    expect(brandElement).toHaveClass("gravitas-one-regular");
  });

  it("should have responsive grid layout", () => {
    const { container } = render(<Footer />);
    const gridContainer = container.querySelector(".grid");

    expect(gridContainer).toHaveClass("grid-cols-1");
    expect(gridContainer).toHaveClass("md:grid-cols-3");
  });
});
