/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from "@testing-library/react";
import useSWR from "swr";

import { Monitoring } from "@/types/monitoring";

import { useFetchGetAllMonitoringSwrCore } from "@/hook/singleton/swrs/monitoring/useFetchGetAllMonitoringSwr";

jest.mock("swr");

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

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
];

describe("useFetchGetAllMonitoringSwrCore", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call useSWR with correct default URL", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    renderHook(() => useFetchGetAllMonitoringSwrCore());

    expect(mockUseSWR).toHaveBeenCalledWith(
      "/monitoring/api/monitorings",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 5000,
      })
    );
  });

  it("should call useSWR with custom URL when provided", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    const customUrl = "/custom/monitoring/url";
    renderHook(() => useFetchGetAllMonitoringSwrCore(customUrl));

    expect(mockUseSWR).toHaveBeenCalledWith(
      customUrl,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should return data when fetch is successful", () => {
    mockUseSWR.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    const { result } = renderHook(() => useFetchGetAllMonitoringSwrCore());

    expect(result.current.data).toEqual(mockMonitoringData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should return error when fetch fails", () => {
    const mockError = new Error("Fetch failed");
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    const { result } = renderHook(() => useFetchGetAllMonitoringSwrCore());

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("should return isLoading state correctly", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    const { result } = renderHook(() => useFetchGetAllMonitoringSwrCore());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it("should return mutate function", () => {
    const mockMutate = jest.fn();
    mockUseSWR.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    } as any);

    const { result } = renderHook(() => useFetchGetAllMonitoringSwrCore());

    expect(result.current.mutate).toBe(mockMutate);
  });

  it("should return isValidating state", () => {
    mockUseSWR.mockReturnValue({
      data: mockMonitoringData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: true,
    } as any);

    const { result } = renderHook(() => useFetchGetAllMonitoringSwrCore());

    expect(result.current.isValidating).toBe(true);
  });

  it("should merge custom options with default options", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    const customOptions = {
      refreshInterval: 10000,
      dedupingInterval: 2000,
    };

    renderHook(() => useFetchGetAllMonitoringSwrCore(undefined, customOptions));

    expect(mockUseSWR).toHaveBeenCalledWith(
      "/monitoring/api/monitorings",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 10000,
        dedupingInterval: 2000,
      })
    );
  });

  it("should have auto refresh interval of 5 seconds by default", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    renderHook(() => useFetchGetAllMonitoringSwrCore());

    const callArgs = mockUseSWR.mock.calls[0];
    const options = callArgs[2] as any;

    expect(options.refreshInterval).toBe(5000);
  });
});
