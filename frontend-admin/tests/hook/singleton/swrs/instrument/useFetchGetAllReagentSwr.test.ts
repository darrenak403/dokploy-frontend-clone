import { renderHook } from "@testing-library/react";

import { useFetchGetAllReagentSwrCore } from "@/hook/singleton/swrs/instrument/useFetchGetAllReagentSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr");

const mockMutate = jest.fn();

describe("useFetchGetAllReagentSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchGetAllReagentSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isValidating).toBe(false);
    expect(typeof result.current.mutate).toBe("function");
  });

  it("should use default URL", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchGetAllReagentSwrCore());

    expect(useSWR).toHaveBeenCalledWith(
      "/instrument/reagents/all",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should use custom URL when provided", () => {
    const useSWR = require("swr").default;
    const customUrl = "/custom/reagents";

    renderHook(() => useFetchGetAllReagentSwrCore(customUrl));

    expect(useSWR).toHaveBeenCalledWith(
      customUrl,
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should pass custom options to useSWR", () => {
    const useSWR = require("swr").default;
    const options = {
      refreshInterval: 5000,
      dedupingInterval: 2000,
    };

    renderHook(() => useFetchGetAllReagentSwrCore(undefined, options));

    expect(useSWR).toHaveBeenCalledWith(
      "/instrument/reagents/all",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 5000,
        dedupingInterval: 2000,
      })
    );
  });

  it("should return data when fetch succeeds", () => {
    const mockData = {
      status: 200,
      message: "Success",
      data: [
        {
          id: 1,
          reagentType: "Chemical",
          reagentName: "Test Reagent",
          lotNumber: "LOT123",
        },
      ],
    };

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchGetAllReagentSwrCore());

    expect(result.current.data).toEqual(mockData);
  });

  it("should return error when fetch fails", () => {
    const mockError = new Error("Failed to fetch reagents");

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchGetAllReagentSwrCore());

    expect(result.current.error).toEqual(mockError);
  });

  it("should set isLoading to true during fetch", () => {
    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchGetAllReagentSwrCore());

    expect(result.current.isLoading).toBe(true);
  });

  it("should set isValidating to true during revalidation", () => {
    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: true,
    });

    const { result } = renderHook(() => useFetchGetAllReagentSwrCore());

    expect(result.current.isValidating).toBe(true);
  });

  it("should return mutate function", () => {
    const { result } = renderHook(() => useFetchGetAllReagentSwrCore());

    expect(result.current.mutate).toBe(mockMutate);
  });

  it("should enable revalidateOnFocus by default", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchGetAllReagentSwrCore());

    const callArgs = useSWR.mock.calls[0];
    expect(callArgs[2]).toMatchObject({
      revalidateOnFocus: true,
    });
  });

  it("should enable revalidateOnReconnect by default", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchGetAllReagentSwrCore());

    const callArgs = useSWR.mock.calls[0];
    expect(callArgs[2]).toMatchObject({
      revalidateOnReconnect: true,
    });
  });

  it("should override default options with custom options", () => {
    const useSWR = require("swr").default;

    renderHook(() =>
      useFetchGetAllReagentSwrCore(undefined, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      })
    );

    const callArgs = useSWR.mock.calls[0];
    expect(callArgs[2]).toMatchObject({
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    });
  });

  it("should handle empty data array", () => {
    const mockData = {
      status: 200,
      message: "Success",
      data: [],
    };

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchGetAllReagentSwrCore());

    expect(result.current.data?.data).toEqual([]);
  });
});
