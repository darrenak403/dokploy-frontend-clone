import { act, renderHook } from "@testing-library/react";

import { useFetchDeleteReagentSwrCore } from "@/hook/singleton/swrs/instrument/useFetchDeleteReagentsSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");

const mockTrigger = jest.fn();

describe("useFetchDeleteReagentSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() =>
      useFetchDeleteReagentSwrCore("reagent-1")
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(typeof result.current.deleteReagent).toBe("function");
  });

  it("should use initial reagentId when no arg provided", async () => {
    const { result } = renderHook(() =>
      useFetchDeleteReagentSwrCore("reagent-1")
    );

    await act(async () => {
      await result.current.deleteReagent({});
    });

    expect(mockTrigger).toHaveBeenCalledWith({});
  });

  it("should use arg reagentId when provided", async () => {
    const { result } = renderHook(() =>
      useFetchDeleteReagentSwrCore("reagent-1")
    );

    await act(async () => {
      await result.current.deleteReagent({ reagentId: "reagent-2" });
    });

    expect(mockTrigger).toHaveBeenCalledWith({ reagentId: "reagent-2" });
  });

  it("should handle numeric reagent ID", async () => {
    const { result } = renderHook(() => useFetchDeleteReagentSwrCore(123));

    await act(async () => {
      await result.current.deleteReagent({ reagentId: 456 });
    });

    expect(mockTrigger).toHaveBeenCalledWith({ reagentId: 456 });
  });

  it("should handle null initial reagent ID with arg", async () => {
    const { result } = renderHook(() => useFetchDeleteReagentSwrCore(null));

    await act(async () => {
      await result.current.deleteReagent({ reagentId: "reagent-3" });
    });

    expect(mockTrigger).toHaveBeenCalledWith({ reagentId: "reagent-3" });
  });

  it("should return data when mutation succeeds", () => {
    const mockData = {
      status: 200,
      error: null,
      message: "Reagent deleted successfully",
      path: "/instrument/reagents/1",
      timestamp: "2024-01-01T00:00:00Z",
      data: {
        reagentId: "1",
        reagentName: "Test Reagent",
        lotNumber: "LOT123",
        deletedBy: "admin",
        action: "DELETE",
        deletedAt: "2024-01-01T00:00:00Z",
      },
    };

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: mockData,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
    });

    const { result } = renderHook(() =>
      useFetchDeleteReagentSwrCore("reagent-1")
    );

    expect(result.current.data).toEqual(mockData);
  });

  it("should return error when mutation fails", () => {
    const mockError = new Error("Failed to delete reagent");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: mockError,
      isMutating: false,
      trigger: mockTrigger,
    });

    const { result } = renderHook(() =>
      useFetchDeleteReagentSwrCore("reagent-1")
    );

    expect(result.current.error).toEqual(mockError);
  });

  it("should set isMutating to true during deletion", () => {
    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: true,
      trigger: mockTrigger,
    });

    const { result } = renderHook(() =>
      useFetchDeleteReagentSwrCore("reagent-1")
    );

    expect(result.current.isMutating).toBe(true);
  });

  it("should pass options to useSWRMutation", () => {
    const useSWRMutation = require("swr/mutation").default;
    const options = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchDeleteReagentSwrCore("reagent-1", options));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/instrument/reagents/{reagentId}",
      expect.any(Function),
      options
    );
  });

  it("should use correct URL pattern", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() => useFetchDeleteReagentSwrCore("reagent-1"));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/instrument/reagents/{reagentId}",
      expect.any(Function),
      undefined
    );
  });

  it("should handle empty arg object", async () => {
    const { result } = renderHook(() =>
      useFetchDeleteReagentSwrCore("reagent-1")
    );

    await act(async () => {
      await result.current.deleteReagent({});
    });

    expect(mockTrigger).toHaveBeenCalledWith({});
  });

  it("should handle string reagent ID in arg", async () => {
    const { result } = renderHook(() =>
      useFetchDeleteReagentSwrCore("default-id")
    );

    await act(async () => {
      await result.current.deleteReagent({ reagentId: "custom-id" });
    });

    expect(mockTrigger).toHaveBeenCalledWith({ reagentId: "custom-id" });
  });

  it("should handle zero as reagent ID", async () => {
    const { result } = renderHook(() => useFetchDeleteReagentSwrCore(0));

    await act(async () => {
      await result.current.deleteReagent({});
    });

    expect(mockTrigger).toHaveBeenCalledWith({});
  });
});
