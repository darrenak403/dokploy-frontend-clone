import React from "react";

import { render, screen } from "@testing-library/react";

import { HighlightFeature } from "@/components/shared/home/HighlightFeature";

// Mock GSAP and ScrollTrigger
jest.mock("gsap", () => ({
  gsap: {
    registerPlugin: jest.fn(),
    context: jest.fn((fn) => {
      fn();
      return { revert: jest.fn() };
    }),
    fromTo: jest.fn(),
  },
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: jest.fn(),
}));

// Mock HeroUI components
jest.mock("@heroui/react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock Iconify
jest.mock("@iconify/react", () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("HighlightFeature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component", () => {
    render(<HighlightFeature />);
    expect(screen.getByText(/Tính năng nổi bật/i)).toBeInTheDocument();
  });

  it("should render section heading", () => {
    render(<HighlightFeature />);
    expect(screen.getByText("Tính năng nổi bật")).toBeInTheDocument();
  });

  it("should render all 6 feature cards", () => {
    render(<HighlightFeature />);

    expect(screen.getByText("Quản lý xét nghiệm máu")).toBeInTheDocument();
    expect(screen.getByText("Quản lý bệnh nhân")).toBeInTheDocument();
    expect(screen.getByText("Giám sát thiết bị")).toBeInTheDocument();
    expect(screen.getByText("Báo cáo thống kê")).toBeInTheDocument();
    expect(screen.getByText("Bảo mật dữ liệu")).toBeInTheDocument();
    expect(screen.getByText("Xử lý nhanh chóng")).toBeInTheDocument();
  });

  it("should render feature descriptions", () => {
    render(<HighlightFeature />);

    expect(
      screen.getByText(/Theo dõi và xử lý các mẫu xét nghiệm/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Lưu trữ thông tin bệnh nhân an toàn/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Theo dõi trạng thái hoạt động/i)
    ).toBeInTheDocument();
  });

  it("should render icons for all features", () => {
    render(<HighlightFeature />);

    expect(screen.getByTestId("icon-mdi:beaker")).toBeInTheDocument();
    expect(screen.getByTestId("icon-mdi:account-group")).toBeInTheDocument();
    expect(screen.getByTestId("icon-pepicons-pop:camera")).toBeInTheDocument();
    expect(screen.getByTestId("icon-mdi:chart-box")).toBeInTheDocument();
    expect(screen.getByTestId("icon-mdi:shield-check")).toBeInTheDocument();
    expect(screen.getByTestId("icon-mdi:clock-fast")).toBeInTheDocument();
  });

  it('should render "Dùng thử" buttons', () => {
    render(<HighlightFeature />);
    const buttons = screen.getAllByText("Dùng thử");
    expect(buttons).toHaveLength(6);
  });

  it('should render "Xem chi tiết" links', () => {
    render(<HighlightFeature />);
    const links = screen.getAllByText(/Xem chi tiết/i);
    expect(links).toHaveLength(6);
  });
});
