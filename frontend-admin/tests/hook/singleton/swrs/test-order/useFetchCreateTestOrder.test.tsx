import { renderHook } from "@testing-library/react";

import {
  CreateTestOrderPayload,
  CreateTestOrderResponse,
} from "@/types/test-order";

import { useFetchCreateTestOrderSwrCore } from "@/hook/singleton/swrs/test-order/useFetchCreateTestOrder";

jest.mock("swr/mutation");

describe("useFetchCreateTestOrderSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateTestOrderSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.createTestOrder).toBeDefined();
    expect(result.current.trigger).toBeDefined();
    expect(result.current.reset).toBeDefined();
  });

  it("should use correct default URL", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    renderHook(() => useFetchCreateTestOrderSwrCore());

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/orders",
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should accept custom URL", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const customUrl = "/api/orders";
    renderHook(() => useFetchCreateTestOrderSwrCore(customUrl));

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      customUrl,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should return test order data on successful creation", () => {
    const mockResponse: CreateTestOrderResponse = {
      status: 201,
      error: null,
      message: "Test order created successfully",
      data: {
        id: 1,
        accessionNumber: "ACC-2024-001",
        patientId: 10,
        patientName: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
        phone: "1234567890",
        gender: "male",
        yob: "1990",
        age: 34,
        status: "pending",
        createdAt: "2024-01-15T10:00:00.000Z",
        priority: {
          key: "high",
          label: "High",
        },
        instrumentId: 5,
        instrumentName: "Instrument A",
        runAt: null,
        runBy: null,
        createdBy: "admin",
        deleted: false,
        results: null,
        comments: [],
      },
    };

    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: mockResponse,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateTestOrderSwrCore());

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.data.accessionNumber).toBe("ACC-2024-001");
    expect(result.current.data?.data.patientName).toBe("John Doe");
  });

  it("should handle error when creation fails", () => {
    const mockError = new Error("Failed to create test order");

    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: mockError,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateTestOrderSwrCore());

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it("should set isMutating to true during creation", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: true,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateTestOrderSwrCore());

    expect(result.current.isMutating).toBe(true);
  });

  it("should call trigger (createTestOrder) with correct payload", () => {
    const mockTrigger = jest.fn();
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateTestOrderSwrCore());

    const payload: CreateTestOrderPayload = {
      patientId: 10,
      priority: "high",
      instrumentId: 5,
      runBy: 3,
    };

    result.current.createTestOrder(payload);

    expect(mockTrigger).toHaveBeenCalledWith(payload);
  });

  it("should accept custom SWR options", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchCreateTestOrderSwrCore("/orders", customOptions));

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/orders",
      expect.any(Function),
      expect.objectContaining(customOptions)
    );
  });
});
