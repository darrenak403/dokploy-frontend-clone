import { renderHook } from "@testing-library/react";

import { useFetchDeleteTestOrderSwrCore } from "@/hook/singleton/swrs/test-order/useFetchDeleteTestOrderSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");

const mockTrigger = jest.fn();

describe("useFetchDeleteTestOrderSwrCore", () => {
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
    const { result } = renderHook(() => useFetchDeleteTestOrderSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.deleteTestOrder).toBeDefined();
  });

  it("should use default URL with {id} placeholder", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() => useFetchDeleteTestOrderSwrCore());

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/orders/{id}",
      expect.any(Function),
      undefined
    );
  });

  it("should call deleteTestOrder with numeric id", async () => {
    const { result } = renderHook(() => useFetchDeleteTestOrderSwrCore());

    await result.current.deleteTestOrder(123);

    expect(mockTrigger).toHaveBeenCalledWith(123);
  });

  it("should call deleteTestOrder with object containing id", async () => {
    const { result } = renderHook(() => useFetchDeleteTestOrderSwrCore());

    await result.current.deleteTestOrder({ id: 456 });

    expect(mockTrigger).toHaveBeenCalledWith({ id: 456 });
  });

  it("should return data on successful deletion", () => {
    const mockData = {
      status: 200,
      message: "Test order deleted successfully",
      data: null,
    };

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: mockData,
      error: undefined,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchDeleteTestOrderSwrCore());

    expect(result.current.data).toEqual(mockData);
  });

  it("should return error on failed deletion", () => {
    const mockError = new Error("Failed to delete test order");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: mockError,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchDeleteTestOrderSwrCore());

    expect(result.current.error).toEqual(mockError);
  });

  it("should show isMutating during deletion", () => {
    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: true,
    });

    const { result } = renderHook(() => useFetchDeleteTestOrderSwrCore());

    expect(result.current.isMutating).toBe(true);
  });

  it("should accept custom options", () => {
    const useSWRMutation = require("swr/mutation").default;
    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() =>
      useFetchDeleteTestOrderSwrCore("/orders/{id}", customOptions)
    );

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/orders/{id}",
      expect.any(Function),
      customOptions
    );
  });
});
