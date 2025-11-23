import { renderHook } from "@testing-library/react";

import { useFetchCreateInstrumentSwrCore } from "@/hook/singleton/swrs/warehouse/useFetchCreateWareHouseIntrustmentSwr";
import {
  CreateInstrumentPayload,
  CreateInstrumentResponse,
} from "@/hook/singleton/swrs/warehouse/useFetchCreateWareHouseIntrustmentSwr";

jest.mock("swr/mutation");

describe("useFetchCreateInstrumentSwrCore", () => {
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

    const { result } = renderHook(() => useFetchCreateInstrumentSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.createInstrument).toBeDefined();
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

    renderHook(() => useFetchCreateInstrumentSwrCore());

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/warehouse/instruments",
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

    const customUrl = "/api/instruments";
    renderHook(() => useFetchCreateInstrumentSwrCore(customUrl));

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      customUrl,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should return instrument data on successful creation", () => {
    const mockResponse: CreateInstrumentResponse = {
      status: 201,
      error: null,
      message: "Instrument created successfully",
      data: {
        id: 1,
        name: "Instrument A",
        serialNumber: "SN-12345",
        status: "active",
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
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateInstrumentSwrCore());

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.data.name).toBe("Instrument A");
    expect(result.current.data?.data.serialNumber).toBe("SN-12345");
  });

  it("should handle error when creation fails", () => {
    const mockError = new Error("Failed to create instrument");

    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: mockError,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateInstrumentSwrCore());

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

    const { result } = renderHook(() => useFetchCreateInstrumentSwrCore());

    expect(result.current.isMutating).toBe(true);
  });

  it("should call trigger (createInstrument) with correct payload", () => {
    const mockTrigger = jest.fn();
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateInstrumentSwrCore());

    const payload: CreateInstrumentPayload = {
      name: "New Instrument",
      serialNumber: "SN-99999",
    };

    result.current.createInstrument(payload);

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

    renderHook(() =>
      useFetchCreateInstrumentSwrCore("/warehouse/instruments", customOptions)
    );

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/warehouse/instruments",
      expect.any(Function),
      expect.objectContaining(customOptions)
    );
  });
});
