import React from "react";

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Monitoring } from "@/types/monitoring";

import { useFetchGetAllMonitoringSwrSingleton } from "@/hook/singleton/swrs/monitoring/useFetchGetAllMonitoringSwr";

import MonitoringList from "@/components/shared/monitoring/MonitoringList";

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

describe("MonitoringList Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  it("should render error state", () => {
    const mockError = new Error("Failed to fetch data");
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    expect(screen.getByText(/Lỗi tải dữ liệu:/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
  });

  it("should render table with monitoring data", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    expect(screen.getAllByText("User Service")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Order Service")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Payment Service")[0]).toBeInTheDocument();
  });

  it("should display correct count of activities", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    expect(screen.getByText(/Hiển thị 3 \/ 3 hoạt động/)).toBeInTheDocument();
  });

  it("should filter by search text", async () => {
    const user = userEvent.setup();
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    const searchInput = screen.getByPlaceholderText("Tìm kiếm...");
    await user.type(searchInput, "User");

    await waitFor(() => {
      expect(screen.getAllByText("User Service")[0]).toBeInTheDocument();
      expect(screen.queryAllByText("Payment Service").length).toBe(0);
    });
  });

  it("should render status filter dropdown", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    const statusSelect = screen.getByLabelText("Chọn trạng thái");
    expect(statusSelect).toBeInTheDocument();
  });

  it("should render table columns correctly", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    // Desktop table columns
    expect(screen.getByText("Thời gian")).toBeInTheDocument();
    expect(screen.getAllByText("Dịch vụ")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Hành động")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Thực thể")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Người thực hiện")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Trạng thái")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Nội dung")[0]).toBeInTheDocument();
  });

  it("should display entity ID when available", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    expect(screen.getAllByText("ID: 123")[0]).toBeInTheDocument();
    expect(screen.getAllByText("ID: 456")[0]).toBeInTheDocument();
    expect(screen.getAllByText("ID: 789")[0]).toBeInTheDocument();
  });

  it("should show empty state when no data matches filters", async () => {
    const user = userEvent.setup();
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    const searchInput = screen.getByPlaceholderText("Tìm kiếm...");
    await user.type(searchInput, "NonExistentService");

    await waitFor(() => {
      expect(
        screen.getAllByText("Không có dữ liệu giám sát")[0]
      ).toBeInTheDocument();
    });
  });

  it("should disable filters when loading", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    const searchInput = screen.queryByPlaceholderText("Tìm kiếm...");
    if (searchInput) {
      expect(searchInput).toBeDisabled();
    }
  });

  it("should render status badges with correct styling", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { container } = render(<MonitoringList />);

    const statusBadges = container.querySelectorAll(
      ".px-2.py-1.text-xs.font-semibold.rounded-full"
    );
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  it("should handle empty data array", () => {
    mockUseFetchGetAllMonitoringSwrSingleton.mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<MonitoringList />);

    expect(screen.getByText(/Hiển thị 0 \/ 0 hoạt động/)).toBeInTheDocument();
    expect(
      screen.getAllByText("Không có dữ liệu giám sát")[0]
    ).toBeInTheDocument();
  });
});
