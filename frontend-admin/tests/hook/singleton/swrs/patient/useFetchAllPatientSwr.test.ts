import { renderHook } from "@testing-library/react";

import { useFetchAllPatientSwrCore } from "@/hook/singleton/swrs/patient/useFetchAllPatientSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr");

const mockMutate = jest.fn();

describe("useFetchAllPatientSwrCore", () => {
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
    const { result } = renderHook(() => useFetchAllPatientSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isValidating).toBe(false);
    expect(typeof result.current.mutate).toBe("function");
  });

  it("should use default URL", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchAllPatientSwrCore());

    expect(useSWR).toHaveBeenCalledWith(
      "/patient",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should use custom URL when provided", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchAllPatientSwrCore("/custom/patients"));

    expect(useSWR).toHaveBeenCalledWith(
      "/custom/patients",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should return paginated patient data", () => {
    const mockData = {
      status: 200,
      message: "Success",
      data: {
        currentPage: 1,
        totalPages: 5,
        pageSize: 10,
        totalItems: 50,
        data: [
          {
            id: 1,
            fullName: "Patient One",
            email: "patient1@example.com",
          },
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

    const { result } = renderHook(() => useFetchAllPatientSwrCore());

    expect(result.current.data).toEqual(mockData);
    expect(result.current.data?.data.currentPage).toBe(1);
    expect(result.current.data?.data.totalItems).toBe(50);
  });

  it("should return error when fetch fails", () => {
    const mockError = new Error("Failed to fetch patients");

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchAllPatientSwrCore());

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

    const { result } = renderHook(() => useFetchAllPatientSwrCore());

    expect(result.current.isLoading).toBe(true);
  });

  it("should pass custom options to useSWR", () => {
    const useSWR = require("swr").default;
    const options = {
      refreshInterval: 3000,
    };

    renderHook(() => useFetchAllPatientSwrCore(undefined, options));

    expect(useSWR).toHaveBeenCalledWith(
      "/patient",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 3000,
      })
    );
  });
});
