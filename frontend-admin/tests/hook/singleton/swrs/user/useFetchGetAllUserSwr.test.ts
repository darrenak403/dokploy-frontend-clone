import { renderHook } from "@testing-library/react";

import { useFetchGetAllUserSwrCore } from "@/hook/singleton/swrs/user/useFetchGetAllUserSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr");

const mockMutate = jest.fn();

describe("useFetchGetAllUserSwrCore", () => {
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
    const { result } = renderHook(() => useFetchGetAllUserSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("should use default URL", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchGetAllUserSwrCore());

    expect(useSWR).toHaveBeenCalledWith(
      "/iam/users",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should use custom URL", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchGetAllUserSwrCore("/iam/users?role=admin"));

    expect(useSWR).toHaveBeenCalledWith(
      "/iam/users?role=admin",
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should return users list", () => {
    const mockData = {
      status: 200,
      data: [
        {
          id: 1,
          email: "user1@example.com",
          fullName: "User One",
          roleId: 1,
          role: "ADMIN",
        },
        {
          id: 2,
          email: "user2@example.com",
          fullName: "User Two",
          roleId: 2,
          role: "USER",
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

    const { result } = renderHook(() => useFetchGetAllUserSwrCore());

    expect(result.current.data).toEqual(mockData);
    expect(result.current.data?.data).toHaveLength(2);
  });

  it("should return error on failed fetch", () => {
    const mockError = new Error("Failed to fetch users");

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchGetAllUserSwrCore());

    expect(result.current.error).toEqual(mockError);
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

    const { result } = renderHook(() => useFetchGetAllUserSwrCore());

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

    const { result } = renderHook(() => useFetchGetAllUserSwrCore());

    expect(result.current.isValidating).toBe(true);
  });

  it("should accept custom options", () => {
    const useSWR = require("swr").default;
    const customOptions = {
      refreshInterval: 5000,
    };

    renderHook(() => useFetchGetAllUserSwrCore("/iam/users", customOptions));

    expect(useSWR).toHaveBeenCalledWith(
      "/iam/users",
      expect.any(Function),
      expect.objectContaining({
        refreshInterval: 5000,
      })
    );
  });
});
