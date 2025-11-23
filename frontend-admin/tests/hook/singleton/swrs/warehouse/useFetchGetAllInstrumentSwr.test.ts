import { renderHook } from "@testing-library/react";

import { useFetchGetAllInstrumentSwrCore } from "@/hook/singleton/swrs/warehouse/useFetchGetAllInstrumentSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr");

const mockMutate = jest.fn();

describe("useFetchGetAllInstrumentSwrCore", () => {
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
    const { result } = renderHook(() => useFetchGetAllInstrumentSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("should use default URL", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchGetAllInstrumentSwrCore());

    expect(useSWR).toHaveBeenCalledWith(
      "/warehouse/instruments",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should return paginated instruments list", () => {
    const mockData = {
      statusCode: 200,
      data: {
        currentPage: 1,
        totalPages: 2,
        pageSize: 10,
        totalItems: 15,
        data: [
          { id: 1, name: "Instrument 1", status: "ACTIVE" },
          { id: 2, name: "Instrument 2", status: "INACTIVE" },
        ],
      },
    };

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchGetAllInstrumentSwrCore());

    expect(result.current.data).toEqual(mockData);
    expect(result.current.data?.data.data).toHaveLength(2);
  });

  it("should return error on failed fetch", () => {
    const mockError = new Error("Failed to fetch instruments");

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchGetAllInstrumentSwrCore());

    expect(result.current.error).toEqual(mockError);
  });

  it("should accept custom URL", () => {
    const useSWR = require("swr").default;

    renderHook(() =>
      useFetchGetAllInstrumentSwrCore("/warehouse/instruments?page=2")
    );

    expect(useSWR).toHaveBeenCalledWith(
      "/warehouse/instruments?page=2",
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should accept custom options", () => {
    const useSWR = require("swr").default;
    const customOptions = {
      refreshInterval: 5000,
    };

    renderHook(() =>
      useFetchGetAllInstrumentSwrCore("/warehouse/instruments", customOptions)
    );

    expect(useSWR).toHaveBeenCalledWith(
      "/warehouse/instruments",
      expect.any(Function),
      expect.objectContaining({
        refreshInterval: 5000,
      })
    );
  });

  it("should show loading state", () => {
    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchGetAllInstrumentSwrCore());

    expect(result.current.isLoading).toBe(true);
  });

  it("should show validating state", () => {
    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: true,
    });

    const { result } = renderHook(() => useFetchGetAllInstrumentSwrCore());

    expect(result.current.isValidating).toBe(true);
  });
});
