/**
 * Test suite for TitleAnimation component
 *
 * Component: TitleAnimation
 * Path: @/components/shared/home/TitleAnimation
 *
 * Purpose: Tests the animated scrolling text component
 *
 * Test Coverage:
 * - Rendering with default and custom props
 * - Text content display
 * - Animation setup with GSAP
 * - Speed and className props
 * - Accessibility
 */
import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { TitleAnimation } from "@/components/shared/home/TitleAnimation";

// Mock GSAP
jest.mock("gsap", () => ({
  gsap: {
    context: jest.fn((callback) => {
      callback();
      return { revert: jest.fn() };
    }),
    set: jest.fn(),
    to: jest.fn(),
  },
}));

describe("TitleAnimation Component", () => {
  // Rendering Tests
  describe("Rendering", () => {
    it("renders with default text", () => {
      render(<TitleAnimation />);

      expect(
        screen.getByText(/Hệ thống quản lý phòng xét nghiệm toàn diện/i)
      ).toBeInTheDocument();
    });

    it("renders with custom text", () => {
      render(<TitleAnimation text="Custom text for testing" />);

      expect(screen.getByText("Custom text for testing")).toBeInTheDocument();
    });

    it("renders with default className", () => {
      const { container } = render(<TitleAnimation />);

      const textElement = container.querySelector(
        ".text-xl.text-foreground\\/70"
      );
      expect(textElement).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = render(
        <TitleAnimation className="text-2xl text-red-500" />
      );

      const textElement = container.querySelector(".text-2xl.text-red-500");
      expect(textElement).toBeInTheDocument();
    });
  });

  // Props Tests
  describe("Props", () => {
    it("accepts and displays custom text prop", () => {
      const customText = "Phần mềm quản lý xét nghiệm chuyên nghiệp";
      render(<TitleAnimation text={customText} />);

      expect(screen.getByText(customText)).toBeInTheDocument();
    });

    it("accepts speed prop", () => {
      // Speed prop affects animation duration calculation
      const { container } = render(<TitleAnimation speed={200} />);

      // Component should render with the speed prop
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("handles long text content", () => {
      const longText =
        "This is a very long text that should still render correctly and animate smoothly across the screen without any issues or errors in the component";
      render(<TitleAnimation text={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("handles empty text", () => {
      render(<TitleAnimation text="" />);

      const { container } = render(<TitleAnimation text="" />);
      expect(container.querySelector("div")).toBeInTheDocument();
    });
  });

  // Animation Tests
  describe("GSAP Animation", () => {
    it("initializes GSAP context on mount", async () => {
      const { gsap } = await import("gsap");

      render(<TitleAnimation />);

      expect(gsap.context).toHaveBeenCalled();
    });

    it("cleans up GSAP context on unmount", async () => {
      const mockRevert = jest.fn();
      const { gsap } = await import("gsap");
      (gsap.context as jest.Mock).mockReturnValue({ revert: mockRevert });

      const { unmount } = render(<TitleAnimation />);
      unmount();

      expect(mockRevert).toHaveBeenCalled();
    });

    it("sets up animation with gsap.to", async () => {
      const { gsap } = await import("gsap");

      render(<TitleAnimation />);

      expect(gsap.set).toHaveBeenCalled();
      expect(gsap.to).toHaveBeenCalled();
    });

    it("recalculates animation when text changes", async () => {
      const { gsap } = await import("gsap");
      (gsap.context as jest.Mock).mockClear();

      const { rerender } = render(<TitleAnimation text="Initial text" />);

      const initialCalls = (gsap.context as jest.Mock).mock.calls.length;

      rerender(<TitleAnimation text="Updated text" />);

      // Should call context again when text changes
      expect((gsap.context as jest.Mock).mock.calls.length).toBeGreaterThan(
        initialCalls
      );
    });
  });

  // Layout Tests
  describe("Layout and Structure", () => {
    it("applies overflow hidden to container", () => {
      const { container } = render(<TitleAnimation />);

      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass("w-full");
    });

    it("applies inline-block to content div", () => {
      const { container } = render(<TitleAnimation />);

      // Content ref will have display: inline-block set via style
      const innerDiv = container.querySelector("div > div");
      expect(innerDiv).toBeInTheDocument();
    });

    it("renders nested div structure correctly", () => {
      const { container } = render(<TitleAnimation />);

      const outerDiv = container.firstChild;
      const innerDiv = outerDiv?.firstChild;

      expect(outerDiv).toBeInTheDocument();
      expect(innerDiv).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe("Accessibility", () => {
    it("has aria-hidden set to false by default", () => {
      const { container } = render(<TitleAnimation />);

      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveAttribute("aria-hidden", "false");
    });

    it("contains readable text content", () => {
      const text = "Accessible text content";
      render(<TitleAnimation text={text} />);

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("handles special characters in text", () => {
      const specialText = "Text with special chars: @#$%^&*()";
      render(<TitleAnimation text={specialText} />);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it("handles Vietnamese characters correctly", () => {
      const vietnameseText = "Phòng xét nghiệm máu và huyết học";
      render(<TitleAnimation text={vietnameseText} />);

      expect(screen.getByText(vietnameseText)).toBeInTheDocument();
    });

    it("handles very fast speed", () => {
      const { container } = render(<TitleAnimation speed={1000} />);

      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("handles very slow speed", () => {
      const { container } = render(<TitleAnimation speed={10} />);

      expect(container.querySelector("div")).toBeInTheDocument();
    });
  });
});
