import { renderHook } from "@testing-library/react";

import { useFetchUpdateInstrumentSwrCore } from "@/hook/singleton/swrs/warehouse/useFetchUpdateWareHouseIntrustmentSwr";
import {
  UpdateInstrumentPayload,
  UpdateInstrumentResponse,
} from "@/hook/singleton/swrs/warehouse/useFetchUpdateWareHouseIntrustmentSwr";

jest.mock("swr/mutation");

describe("useFetchUpdateInstrumentSwrCore", () => {
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
    });

    const { result } = renderHook(() => useFetchUpdateInstrumentSwrCore(1));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.updateInstrument).toBeDefined();
  });

  it("should use correct URL pattern", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
    });

    renderHook(() => useFetchUpdateInstrumentSwrCore(1));

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/warehouse/instruments/{id}",
      expect.any(Function),
      undefined
    );
  });

  it("should return updated instrument data on success", () => {
    const mockResponse: UpdateInstrumentResponse = {
      statusCode: 200,
      error: null,
      message: "Instrument updated successfully",
      data: {
        id: 1,
        name: "Updated Instrument",
        serialNumber: "SN-12345",
        status: "inactive",
        createdAt: "2024-01-15T10:00:00.000Z",
        createdBy: "admin",
      },
    };

    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: mockResponse,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
    });

    const { result } = renderHook(() => useFetchUpdateInstrumentSwrCore(1));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.data?.status).toBe("inactive");
  });

  it("should handle error when update fails", () => {
    const mockError = new Error("Failed to update instrument");

    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: mockError,
      isMutating: false,
      trigger: jest.fn(),
    });

    const { result } = renderHook(() => useFetchUpdateInstrumentSwrCore(1));

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it("should set isMutating to true during update", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: true,
      trigger: jest.fn(),
    });

    const { result } = renderHook(() => useFetchUpdateInstrumentSwrCore(1));

    expect(result.current.isMutating).toBe(true);
  });

  it("should call updateInstrument with correct payload", async () => {
    const mockTrigger = jest.fn();
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
    });

    const { result } = renderHook(() => useFetchUpdateInstrumentSwrCore(1));

    const payload: UpdateInstrumentPayload = {
      status: "inactive",
    };

    await result.current.updateInstrument({
      id: 1,
      payload,
    });

    expect(mockTrigger).toHaveBeenCalledWith({
      id: 1,
      payload,
    });
  });

  it("should use initialId when id is not provided in arg", async () => {
    const mockTrigger = jest.fn();
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
    });

    const { result } = renderHook(() => useFetchUpdateInstrumentSwrCore(5));

    const payload: UpdateInstrumentPayload = {
      status: "active",
    };

    await result.current.updateInstrument({
      payload,
    });

    expect(mockTrigger).toHaveBeenCalledWith({
      payload,
    });
  });

  it("should accept custom options", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
    });

    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchUpdateInstrumentSwrCore(1, customOptions));

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/warehouse/instruments/{id}",
      expect.any(Function),
      customOptions
    );
  });
});
