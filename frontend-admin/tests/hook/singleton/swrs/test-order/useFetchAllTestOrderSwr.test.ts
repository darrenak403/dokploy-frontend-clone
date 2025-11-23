import { renderHook } from "@testing-library/react";

import { useFetchAllTestOrderSwrCore } from "@/hook/singleton/swrs/test-order/useFetchAllTestOrderSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr");

const mockMutate = jest.fn();

describe("useFetchAllTestOrderSwrCore", () => {
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
    const { result } = renderHook(() => useFetchAllTestOrderSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("should use default URL", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchAllTestOrderSwrCore());

    expect(useSWR).toHaveBeenCalledWith(
      "/orders",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should normalize data with list field", () => {
    const mockData = {
      status: 200,
      message: "Success",
      data: {
        currentPage: 1,
        totalPages: 3,
        pageSize: 10,
        totalItems: 30,
        list: [{ id: 1, patientName: "Patient 1" }],
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

    const { result } = renderHook(() => useFetchAllTestOrderSwrCore());

    expect(result.current.data?.data.list).toHaveLength(1);
  });

  it("should normalize data from testOrders field", () => {
    const mockData = {
      status: 200,
      data: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        totalItems: 2,
        testOrders: [{ id: 1 }, { id: 2 }],
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

    const { result } = renderHook(() => useFetchAllTestOrderSwrCore());

    expect(result.current.data?.data.list).toHaveLength(2);
  });

  it("should return empty array when no list or testOrders", () => {
    const mockData = {
      status: 200,
      data: {
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        totalItems: 0,
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

    const { result } = renderHook(() => useFetchAllTestOrderSwrCore());

    expect(result.current.data?.data.list).toEqual([]);
  });

  it("should pass custom options to useSWR", () => {
    const useSWR = require("swr").default;

    renderHook(() =>
      useFetchAllTestOrderSwrCore(undefined, { refreshInterval: 5000 })
    );

    expect(useSWR).toHaveBeenCalledWith(
      "/orders",
      expect.any(Function),
      expect.objectContaining({
        refreshInterval: 5000,
      })
    );
  });
});
