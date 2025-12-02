import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Monitoring } from "@/types/monitoring";

import { useFetchGetAllMonitoringSwrSingleton } from "@/hook/singleton/swrs/monitoring/useFetchGetAllMonitoringSwr";

import MonitoringStat from "@/components/shared/monitoring/MonitoringStat";

jest.mock("@/hook/singleton/swrs/monitoring/useFetchGetAllMonitoringSwr");

const mockUseFetchGetAllMonitoringSwrSingleton =
  useFetchGetAllMonitoringSwrSingleton as jest.MockedFunction<
    typeof useFetchGetAllMonitoringSwrSingleton
  >;

const mockMonitoringData: Monitoring[] = [
  {
    service: "User Service",
    action: "CREATE",
    entity: "User",
    entityId: "123",
    performedBy: "admin@example.com",
    status: "SUCCESS",
    message: "User created successfully",
    traceId: "trace-1",
    timestamp: "2025-11-22T10:00:00Z",
  },
  {
    service: "Order Service",
    action: "UPDATE",
    entity: "Order",
    entityId: "456",
    performedBy: "user@example.com",
    status: "FAILURE",
    message: "Order update failed",
    traceId: "trace-2",
    timestamp: "2025-11-22T09:30:00Z",
  },
  {
    service: "Payment Service",
    action: "DELETE",
    entity: "Payment",
    entityId: "789",
    performedBy: "admin@example.com",
    status: "ERROR",
    message: "Payment deletion error",
    traceId: "trace-3",
    timestamp: "2025-11-22T10:30:00Z",
  },
];

describe("MonitoringStat Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render all stat cards when data is loaded", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringStat />);

    expect(screen.getByText("Tổng số hoạt động")).toBeInTheDocument();
    expect(screen.getByText("Thành công")).toBeInTheDocument();
    expect(screen.getByText("Thất bại")).toBeInTheDocument();
    expect(screen.getByText("Lỗi")).toBeInTheDocument();
    expect(screen.getByText("Hoạt động gần đây")).toBeInTheDocument();
    expect(screen.getByText("Dịch vụ hoạt động")).toBeInTheDocument();
    expect(screen.getByText("Người thực hiện")).toBeInTheDocument();
  });

  it("should display correct total count", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { container } = render(<MonitoringStat />);

    const totalCard = Array.from(container.querySelectorAll("div")).find(
      (div) =>
        div.textContent?.includes("Tổng số hoạt động") &&
        div.textContent?.includes("3")
    );
    expect(totalCard).toBeTruthy();
  });

  it("should display correct success count and rate", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { container } = render(<MonitoringStat />);

    const successCard = Array.from(container.querySelectorAll("div")).find(
      (div) =>
        div.textContent?.includes("Thành công") &&
        div.textContent?.includes("1")
    );
    expect(successCard).toBeTruthy();
    expect(screen.getByText("Tỷ lệ thành công: 33.3%")).toBeInTheDocument();
  });

  it("should display correct failure and error counts", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringStat />);

    const failureAndErrorCounts = screen.getAllByText("1");
    expect(failureAndErrorCounts.length).toBeGreaterThanOrEqual(2);
  });

  it("should display loading state", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringStat />);

    const loadingIndicators = screen.getAllByText("…");
    expect(loadingIndicators.length).toBeGreaterThan(0);
  });

  it("should display zero values when no data", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringStat />);

    expect(screen.getByText("Tỷ lệ thành công: 0%")).toBeInTheDocument();
    const zeroValues = screen.getAllByText("0");
    expect(zeroValues.length).toBeGreaterThan(0);
  });

  it("should count unique services correctly", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { container } = render(<MonitoringStat />);

    const serviceCard = Array.from(container.querySelectorAll("div")).find(
      (div) =>
        div.textContent?.includes("Dịch vụ hoạt động") &&
        div.textContent?.includes("3")
    );
    expect(serviceCard).toBeTruthy();
  });

  it("should count unique performers correctly", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { container } = render(<MonitoringStat />);

    const performersCard = Array.from(container.querySelectorAll("div")).find(
      (div) =>
        div.textContent?.includes("Người thực hiện") &&
        div.textContent?.includes("2")
    );
    expect(performersCard).toBeTruthy();
  });

  it("should render with proper aria-label", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringStat />);

    const section = screen.getByLabelText("Monitoring statistics");
    expect(section).toBeInTheDocument();
  });

  it("should apply correct CSS classes for responsive grid", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { container } = render(<MonitoringStat />);

    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass(
      "grid-cols-2",
      "sm:grid-cols-3",
      "md:grid-cols-4",
      "lg:grid-cols-5",
      "xl:grid-cols-7"
    );
  });
});
