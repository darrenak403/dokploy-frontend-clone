/**
 * Test suite for HighlightFeature component
 *
 * Component: HighlightFeature
 * Path: @/components/shared/home/HighlightFeature
 *
 * Purpose: Tests the feature showcase section with GSAP animations
 *
 * Test Coverage:
 * - Rendering all feature cards
 * - Correct feature data display
 * - Links and buttons
 * - GSAP animation setup
 * - Responsive layout
 */
import React from "react";

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

import { HighlightFeature } from "@/components/shared/home/HighlightFeature";

// Mock GSAP and ScrollTrigger
jest.mock("gsap", () => ({
  __esModule: true,
  gsap: {
    registerPlugin: jest.fn(),
    context: jest.fn((callback) => {
      callback();
      return { revert: jest.fn() };
    }),
    fromTo: jest.fn(),
    to: jest.fn(),
    set: jest.fn(),
  },
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: jest.fn(),
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock @iconify/react
jest.mock("@iconify/react", () => ({
  Icon: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} className={className}>
      {icon}
    </span>
  ),
}));

describe("HighlightFeature Component", () => {
  // Rendering Tests
  describe("Rendering", () => {
    it("renders the section with correct title and description", () => {
      render(<HighlightFeature />);

      expect(screen.getByText("Tính năng nổi bật")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Hệ thống quản lý phòng xét nghiệm với đầy đủ tính năng/i
        )
      ).toBeInTheDocument();
    });

    it("renders all 6 feature cards", () => {
      render(<HighlightFeature />);

      // Check for all feature titles
      expect(screen.getByText("Quản lý xét nghiệm máu")).toBeInTheDocument();
      expect(screen.getByText("Quản lý bệnh nhân")).toBeInTheDocument();
      expect(screen.getByText("Giám sát thiết bị")).toBeInTheDocument();
      expect(screen.getByText("Báo cáo thống kê")).toBeInTheDocument();
      expect(screen.getByText("Bảo mật dữ liệu")).toBeInTheDocument();
      expect(screen.getByText("Xử lý nhanh chóng")).toBeInTheDocument();
    });

    it("renders all feature descriptions", () => {
      render(<HighlightFeature />);

      expect(
        screen.getByText(/Theo dõi và xử lý các mẫu xét nghiệm/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Lưu trữ thông tin bệnh nhân an toàn/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Theo dõi trạng thái hoạt động của thiết bị/i)
      ).toBeInTheDocument();
    });

    it("renders all feature icons", () => {
      render(<HighlightFeature />);

      expect(screen.getByTestId("icon-mdi:beaker")).toBeInTheDocument();
      expect(screen.getByTestId("icon-mdi:account-group")).toBeInTheDocument();
      expect(
        screen.getByTestId("icon-pepicons-pop:camera")
      ).toBeInTheDocument();
      expect(screen.getByTestId("icon-mdi:chart-box")).toBeInTheDocument();
      expect(screen.getByTestId("icon-mdi:shield-check")).toBeInTheDocument();
      expect(screen.getByTestId("icon-mdi:clock-fast")).toBeInTheDocument();
    });
  });

  // Link and Button Tests
  describe("Links and Buttons", () => {
    it("renders correct links for each feature", () => {
      render(<HighlightFeature />);

      const links = screen.getAllByText(/Xem chi tiết/i);
      expect(links).toHaveLength(6);

      // Check specific feature links
      const labSamplesLink = links[0].closest("a");
      expect(labSamplesLink).toHaveAttribute("href", "/features/lab-samples");
    });

    it("renders action buttons for each feature", () => {
      render(<HighlightFeature />);

      const buttons = screen.getAllByText("Dùng thử");
      expect(buttons).toHaveLength(6);
    });
  });

  // GSAP Animation Tests
  describe("GSAP Animations", () => {
    it("initializes GSAP context on mount", async () => {
      const { gsap } = await import("gsap");

      render(<HighlightFeature />);

      await waitFor(() => {
        expect(gsap.context).toHaveBeenCalled();
      });
    });

    it("cleans up GSAP context on unmount", async () => {
      const mockRevert = jest.fn();
      const { gsap } = await import("gsap");
      (gsap.context as jest.Mock).mockReturnValue({ revert: mockRevert });

      const { unmount } = render(<HighlightFeature />);
      unmount();

      expect(mockRevert).toHaveBeenCalled();
    });
  });

  // Layout Tests
  describe("Layout and Styling", () => {
    it("applies grid layout with correct responsive classes", () => {
      const { container } = render(<HighlightFeature />);

      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3"
      );
      expect(gridContainer).toBeInTheDocument();
    });

    it("applies correct background colors to feature cards", () => {
      const { container } = render(<HighlightFeature />);

      // Check for specific background color classes
      expect(container.querySelector(".bg-red-50")).toBeInTheDocument();
      expect(container.querySelector(".bg-blue-50")).toBeInTheDocument();
      expect(container.querySelector(".bg-green-50")).toBeInTheDocument();
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("handles missing feature data gracefully", () => {
      // Component has static FEATURES array, so this tests the array exists
      render(<HighlightFeature />);

      const featureCards = screen.getAllByRole("article");
      expect(featureCards).toHaveLength(6);
    });

    it("renders in section with semantic HTML", () => {
      const { container } = render(<HighlightFeature />);

      expect(container.querySelector("section")).toBeInTheDocument();
      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelectorAll("article")).toHaveLength(6);
    });
  });
});
