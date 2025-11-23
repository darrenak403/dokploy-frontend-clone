import { renderHook } from "@testing-library/react";

import { useFetchGetAllRoleSwrCore } from "@/hook/singleton/swrs/roles/useFetchGetAllRoleSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr");

const mockMutate = jest.fn();

describe("useFetchGetAllRoleSwrCore", () => {
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
    const { result } = renderHook(() => useFetchGetAllRoleSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("should use default URL", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchGetAllRoleSwrCore());

    expect(useSWR).toHaveBeenCalledWith(
      "/iam/roles",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should return roles list", () => {
    const mockData = {
      status: 200,
      data: [
        { id: 1, name: "Admin", description: "Administrator role" },
        { id: 2, name: "User", description: "Regular user role" },
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

    const { result } = renderHook(() => useFetchGetAllRoleSwrCore());

    expect(result.current.data).toEqual(mockData);
    expect(result.current.data?.data).toHaveLength(2);
  });

  it("should return error on failed fetch", () => {
    const mockError = new Error("Failed to fetch roles");

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchGetAllRoleSwrCore());

    expect(result.current.error).toEqual(mockError);
  });

  it("should accept custom URL", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchGetAllRoleSwrCore("/iam/roles?active=true"));

    expect(useSWR).toHaveBeenCalledWith(
      "/iam/roles?active=true",
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should accept custom options", () => {
    const useSWR = require("swr").default;
    const customOptions = {
      refreshInterval: 5000,
    };

    renderHook(() => useFetchGetAllRoleSwrCore("/iam/roles", customOptions));

    expect(useSWR).toHaveBeenCalledWith(
      "/iam/roles",
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

    const { result } = renderHook(() => useFetchGetAllRoleSwrCore());

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

    const { result } = renderHook(() => useFetchGetAllRoleSwrCore());

    expect(result.current.isValidating).toBe(true);
  });
});
