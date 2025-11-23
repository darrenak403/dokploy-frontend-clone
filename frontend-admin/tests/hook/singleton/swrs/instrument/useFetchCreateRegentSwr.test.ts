import { act, renderHook } from "@testing-library/react";

import { postFetcher } from "@/libs/fetcher";

import { useFetchCreateRegentSwrCore } from "@/hook/singleton/swrs/instrument/useFetchCreateRegentSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");

const mockTrigger = jest.fn();
const mockReset = jest.fn();

describe("useFetchCreateRegentSwrCore", () => {
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
    const { result } = renderHook(() => useFetchCreateRegentSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(typeof result.current.createInstrument).toBe("function");
    expect(typeof result.current.trigger).toBe("function");
    expect(typeof result.current.reset).toBe("function");
  });

  it("should use default URL", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() => useFetchCreateRegentSwrCore());

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/instrument/reagents/install",
      postFetcher,
      {}
    );
  });

  it("should use custom URL when provided", () => {
    const useSWRMutation = require("swr/mutation").default;
    const customUrl = "/custom/reagents/create";

    renderHook(() => useFetchCreateRegentSwrCore(customUrl));

    expect(useSWRMutation).toHaveBeenCalledWith(customUrl, postFetcher, {});
  });

  it("should pass options to useSWRMutation", () => {
    const useSWRMutation = require("swr/mutation").default;
    const options = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchCreateRegentSwrCore(undefined, options));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/instrument/reagents/install",
      postFetcher,
      options
    );
  });

  it("should return trigger function as createInstrument", () => {
    const { result } = renderHook(() => useFetchCreateRegentSwrCore());

    expect(result.current.createInstrument).toBe(mockTrigger);
    expect(result.current.trigger).toBe(mockTrigger);
  });

  it("should call trigger when createInstrument is invoked", async () => {
    const { result } = renderHook(() => useFetchCreateRegentSwrCore());

    const payload = {
      reagentType: "Chemical",
      reagentName: "Test Reagent",
      lotNumber: "LOT123",
      quantity: 100,
      unit: "ml",
      expiryDate: "2025-12-31",
      vendorId: "V001",
      vendorName: "Test Vendor",
      vendorContact: "0123456789",
      remarks: "Test remarks",
    };

    await act(async () => {
      await result.current.createInstrument(payload);
    });

    expect(mockTrigger).toHaveBeenCalledWith(payload);
  });

  it("should return data when mutation succeeds", () => {
    const mockData = {
      status: 200,
      message: "Success",
      data: {
        id: 1,
        reagentType: "Chemical",
        reagentName: "Test Reagent",
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

    const { result } = renderHook(() => useFetchCreateRegentSwrCore());

    expect(result.current.data).toEqual(mockData);
  });

  it("should return error when mutation fails", () => {
    const mockError = new Error("Failed to create reagent");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: mockError,
      isMutating: false,
      trigger: mockTrigger,
      reset: mockReset,
    });

    const { result } = renderHook(() => useFetchCreateRegentSwrCore());

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

    const { result } = renderHook(() => useFetchCreateRegentSwrCore());

    expect(result.current.isMutating).toBe(true);
  });

  it("should call reset function", async () => {
    const { result } = renderHook(() => useFetchCreateRegentSwrCore());

    await act(async () => {
      await result.current.reset();
    });

    expect(mockReset).toHaveBeenCalled();
  });

  it("should handle trigger with empty options", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() =>
      useFetchCreateRegentSwrCore("/instrument/reagents/install")
    );

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/instrument/reagents/install",
      postFetcher,
      {}
    );
  });
});
