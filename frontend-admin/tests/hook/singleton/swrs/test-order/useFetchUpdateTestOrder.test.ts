import { renderHook } from "@testing-library/react";

import { useFetchUpdateTestOrderSwrCore } from "@/hook/singleton/swrs/test-order/useFetchUpdateTestOrder";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");

const mockTrigger = jest.fn();

describe("useFetchUpdateTestOrderSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: false,
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchUpdateTestOrderSwrCore(123));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.updateTestOrder).toBeDefined();
  });

  it("should use initialId when not provided in trigger", async () => {
    const { result } = renderHook(() => useFetchUpdateTestOrderSwrCore(123));

    await result.current.updateTestOrder({
      payload: {
        fullName: "Test Patient",
        yob: "1990",
        gender: "Male",
      },
    });

    expect(mockTrigger).toHaveBeenCalledWith({
      payload: expect.objectContaining({ fullName: "Test Patient" }),
    });
  });

  it("should accept id in trigger argument", async () => {
    const { result } = renderHook(() => useFetchUpdateTestOrderSwrCore(null));

    await result.current.updateTestOrder({
      id: 456,
      payload: {
        fullName: "Updated Patient",
        phone: "123456789",
        address: "123 Test St",
      },
    });

    expect(mockTrigger).toHaveBeenCalledWith({
      id: 456,
      payload: expect.objectContaining({ fullName: "Updated Patient" }),
    });
  });

  it("should return data on successful update", () => {
    const mockData = {
      status: 200,
      message: "Test order updated successfully",
      data: {
        id: 123,
        patientId: 1,
        patientName: "Test Patient",
        status: "COMPLETED",
      },
    };

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: mockData,
      error: undefined,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchUpdateTestOrderSwrCore(123));

    expect(result.current.data).toEqual(mockData);
  });

  it("should return error on failed update", () => {
    const mockError = new Error("Failed to update test order");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: mockError,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchUpdateTestOrderSwrCore(123));

    expect(result.current.error).toEqual(mockError);
  });

  it("should show isMutating during update", () => {
    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: true,
    });

    const { result } = renderHook(() => useFetchUpdateTestOrderSwrCore(123));

    expect(result.current.isMutating).toBe(true);
  });

  it("should accept custom options", () => {
    const useSWRMutation = require("swr/mutation").default;
    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchUpdateTestOrderSwrCore(123, customOptions));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/orders/{id}",
      expect.any(Function),
      customOptions
    );
  });
});
