import { act, renderHook } from "@testing-library/react";

import { postFetcher } from "@/libs/fetcher";

import { useFetchRecieveResultFromInstrumentSwrCore } from "@/hook/singleton/swrs/instrument/useFetchRecieveResultFromInstrumentSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");

const mockTrigger = jest.fn();
const mockReset = jest.fn();

describe("useFetchRecieveResultFromInstrumentSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
      reset: mockReset,
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() =>
      useFetchRecieveResultFromInstrumentSwrCore()
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(typeof result.current.trigger).toBe("function");
    expect(typeof result.current.reset).toBe("function");
  });

  it("should use default URL", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() => useFetchRecieveResultFromInstrumentSwrCore());

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/instrument/blood-analysis/hl7",
      postFetcher,
      {}
    );
  });

  it("should use custom URL when provided", () => {
    const useSWRMutation = require("swr/mutation").default;
    const customUrl = "/custom/hl7/receive";

    renderHook(() => useFetchRecieveResultFromInstrumentSwrCore(customUrl));

    expect(useSWRMutation).toHaveBeenCalledWith(customUrl, postFetcher, {});
  });

  it("should pass options to useSWRMutation", () => {
    const useSWRMutation = require("swr/mutation").default;
    const options = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() =>
      useFetchRecieveResultFromInstrumentSwrCore(undefined, options)
    );

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/instrument/blood-analysis/hl7",
      postFetcher,
      options
    );
  });

  it("should call trigger with payload", async () => {
    const { result } = renderHook(() =>
      useFetchRecieveResultFromInstrumentSwrCore()
    );

    const payload = {
      accessionNumber: "ACC123",
      reagentId: "RG001",
    };

    await act(async () => {
      await result.current.trigger(payload);
    });

    expect(mockTrigger).toHaveBeenCalledWith(payload);
  });

  it("should return data when mutation succeeds", () => {
    const mockData = {
      status: 200,
      message: "Success",
      data: {
        status: "SUCCESS",
        hl7Message: "MSH|^~\\&|...",
        testOrderId: 123,
        instrumentStatus: "ACTIVE",
      },
    };

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: mockData,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
      reset: mockReset,
    });

    const { result } = renderHook(() =>
      useFetchRecieveResultFromInstrumentSwrCore()
    );

    expect(result.current.data).toEqual(mockData);
  });

  it("should return error when mutation fails", () => {
    const mockError = new Error("Failed to receive HL7 message");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: mockError,
      isMutating: false,
      trigger: mockTrigger,
      reset: mockReset,
    });

    const { result } = renderHook(() =>
      useFetchRecieveResultFromInstrumentSwrCore()
    );

    expect(result.current.error).toEqual(mockError);
  });

  it("should set isMutating to true during mutation", () => {
    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: true,
      trigger: mockTrigger,
      reset: mockReset,
    });

    const { result } = renderHook(() =>
      useFetchRecieveResultFromInstrumentSwrCore()
    );

    expect(result.current.isMutating).toBe(true);
  });

  it("should call reset function", async () => {
    const { result } = renderHook(() =>
      useFetchRecieveResultFromInstrumentSwrCore()
    );

    await act(async () => {
      await result.current.reset();
    });

    expect(mockReset).toHaveBeenCalled();
  });

  it("should handle payload with accessionNumber only", async () => {
    const { result } = renderHook(() =>
      useFetchRecieveResultFromInstrumentSwrCore()
    );

    const payload = {
      accessionNumber: "ACC456",
      reagentId: "",
    };

    await act(async () => {
      await result.current.trigger(payload);
    });

    expect(mockTrigger).toHaveBeenCalledWith(payload);
  });

  it("should handle response without optional fields", () => {
    const mockData = {
      data: {
        status: "PENDING",
      },
    };

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: mockData,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
      reset: mockReset,
    });

    const { result } = renderHook(() =>
      useFetchRecieveResultFromInstrumentSwrCore()
    );

    expect(result.current.data?.data?.status).toBe("PENDING");
    expect(result.current.data?.data?.hl7Message).toBeUndefined();
  });

  it("should handle empty options", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() => useFetchRecieveResultFromInstrumentSwrCore());

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/instrument/blood-analysis/hl7",
      postFetcher,
      {}
    );
  });

  it("should handle response with all optional fields", () => {
    const mockData = {
      status: 201,
      error: null,
      message: "HL7 message received",
      path: "/instrument/blood-analysis/hl7",
      timestamp: "2024-01-01T00:00:00Z",
      data: {
        status: "SUCCESS",
        hl7Message: "MSH|^~\\&|LAB|...",
        testOrderId: 789,
        instrumentStatus: "READY",
      },
    };

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: mockData,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
      reset: mockReset,
    });

    const { result } = renderHook(() =>
      useFetchRecieveResultFromInstrumentSwrCore()
    );

    expect(result.current.data).toEqual(mockData);
  });
});
