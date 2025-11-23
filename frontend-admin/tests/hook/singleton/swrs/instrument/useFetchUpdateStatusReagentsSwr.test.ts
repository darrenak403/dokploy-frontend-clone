import { act, renderHook } from "@testing-library/react";

import { useFetchUpdateStatusReagentsSwrCore } from "@/hook/singleton/swrs/instrument/useFetchUpdateStatusReagentsSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");

const mockTrigger = jest.fn();

describe("useFetchUpdateStatusReagentsSwrCore", () => {
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
      useFetchUpdateStatusReagentsSwrCore("reagent-1")
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(typeof result.current.updateReagentStatus).toBe("function");
  });

  it("should use initial reagentId when no arg provided", async () => {
    const { result } = renderHook(() =>
      useFetchUpdateStatusReagentsSwrCore("reagent-1")
    );

    const payload = {
      reagentStatus: "AVAILABLE" as const,
      quantity: 100,
    };

    await act(async () => {
      await result.current.updateReagentStatus({ payload });
    });

    expect(mockTrigger).toHaveBeenCalledWith({ payload });
  });

  it("should use arg reagentId when provided", async () => {
    const { result } = renderHook(() =>
      useFetchUpdateStatusReagentsSwrCore("reagent-1")
    );

    const payload = {
      reagentStatus: "OUT_OF_STOCK" as const,
      quantity: 0,
    };

    await act(async () => {
      await result.current.updateReagentStatus({
        reagentId: "reagent-2",
        payload,
      });
    });

    expect(mockTrigger).toHaveBeenCalledWith({
      reagentId: "reagent-2",
      payload,
    });
  });

  it("should handle numeric reagent ID", async () => {
    const { result } = renderHook(() =>
      useFetchUpdateStatusReagentsSwrCore(123)
    );

    const payload = {
      reagentStatus: "EXPIRED" as const,
      quantity: 50,
    };

    await act(async () => {
      await result.current.updateReagentStatus({ reagentId: 456, payload });
    });

    expect(mockTrigger).toHaveBeenCalledWith({ reagentId: 456, payload });
  });

  it("should handle null initial reagent ID with arg", async () => {
    const { result } = renderHook(() =>
      useFetchUpdateStatusReagentsSwrCore(null)
    );

    const payload = {
      reagentStatus: "AVAILABLE" as const,
      quantity: 200,
    };

    await act(async () => {
      await result.current.updateReagentStatus({
        reagentId: "reagent-3",
        payload,
      });
    });

    expect(mockTrigger).toHaveBeenCalledWith({
      reagentId: "reagent-3",
      payload,
    });
  });

  it("should return data when mutation succeeds", () => {
    const mockData = {
      status: 200,
      error: null,
      message: "Status updated successfully",
      path: "/instrument/reagents/1",
      timestamp: "2024-01-01T00:00:00Z",
      data: {
        reagentName: "Test Reagent",
        oldStatus: "AVAILABLE",
        newStatus: "OUT_OF_STOCK",
        oldQuantity: 100,
        newQuantity: 0,
        updatedBy: "admin",
        action: "UPDATE_STATUS",
        timestamp: "2024-01-01T00:00:00Z",
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
      useFetchUpdateStatusReagentsSwrCore("reagent-1")
    );

    expect(result.current.data).toEqual(mockData);
  });

  it("should return error when mutation fails", () => {
    const mockError = new Error("Failed to update status");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: mockError,
      isMutating: false,
      trigger: mockTrigger,
    });

    const { result } = renderHook(() =>
      useFetchUpdateStatusReagentsSwrCore("reagent-1")
    );

    expect(result.current.error).toEqual(mockError);
  });

  it("should set isMutating to true during update", () => {
    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: true,
      trigger: mockTrigger,
    });

    const { result } = renderHook(() =>
      useFetchUpdateStatusReagentsSwrCore("reagent-1")
    );

    expect(result.current.isMutating).toBe(true);
  });

  it("should pass options to useSWRMutation", () => {
    const useSWRMutation = require("swr/mutation").default;
    const options = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchUpdateStatusReagentsSwrCore("reagent-1", options));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/instrument/reagents/{reagentId}",
      expect.any(Function),
      options
    );
  });

  it("should use correct URL pattern", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() => useFetchUpdateStatusReagentsSwrCore("reagent-1"));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/instrument/reagents/{reagentId}",
      expect.any(Function),
      undefined
    );
  });

  it("should handle all reagent status types", async () => {
    const { result } = renderHook(() =>
      useFetchUpdateStatusReagentsSwrCore("reagent-1")
    );

    const statuses = ["AVAILABLE", "OUT_OF_STOCK", "EXPIRED"] as const;

    for (const status of statuses) {
      const payload = {
        reagentStatus: status,
        quantity: 10,
      };

      await act(async () => {
        await result.current.updateReagentStatus({ payload });
      });

      expect(mockTrigger).toHaveBeenCalledWith({ payload });
    }
  });

  it("should handle payload without reagentId", async () => {
    const { result } = renderHook(() =>
      useFetchUpdateStatusReagentsSwrCore("default-id")
    );

    const payload = {
      reagentStatus: "AVAILABLE" as const,
      quantity: 75,
    };

    await act(async () => {
      await result.current.updateReagentStatus({ payload });
    });

    expect(mockTrigger).toHaveBeenCalledWith({ payload });
  });

  it("should handle zero quantity", async () => {
    const { result } = renderHook(() =>
      useFetchUpdateStatusReagentsSwrCore("reagent-1")
    );

    const payload = {
      reagentStatus: "OUT_OF_STOCK" as const,
      quantity: 0,
    };

    await act(async () => {
      await result.current.updateReagentStatus({ payload });
    });

    expect(mockTrigger).toHaveBeenCalledWith({ payload });
  });

  it("should handle large quantity", async () => {
    const { result } = renderHook(() =>
      useFetchUpdateStatusReagentsSwrCore("reagent-1")
    );

    const payload = {
      reagentStatus: "AVAILABLE" as const,
      quantity: 99999,
    };

    await act(async () => {
      await result.current.updateReagentStatus({ payload });
    });

    expect(mockTrigger).toHaveBeenCalledWith({ payload });
  });

  it("should handle response with complete data", () => {
    const mockData = {
      status: 200,
      error: null,
      message: "Updated",
      path: "/instrument/reagents/123",
      timestamp: "2024-01-01T12:00:00Z",
      data: {
        reagentName: "Blood Sample Reagent",
        oldStatus: "AVAILABLE",
        newStatus: "EXPIRED",
        oldQuantity: 50,
        newQuantity: 50,
        updatedBy: "lab_admin",
        action: "MARK_EXPIRED",
        timestamp: "2024-01-01T12:00:00Z",
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
      useFetchUpdateStatusReagentsSwrCore("reagent-1")
    );

    expect(result.current.data).toEqual(mockData);
    expect(result.current.data?.data.newStatus).toBe("EXPIRED");
  });
});
