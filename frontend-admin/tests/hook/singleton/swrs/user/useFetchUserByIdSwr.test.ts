import { renderHook } from "@testing-library/react";

import { useFetchUserByIdSwrCore } from "@/hook/singleton/swrs/user/useFetchUserByIdSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr");

const mockMutate = jest.fn();

describe("useFetchUserByIdSwrCore", () => {
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
    const { result } = renderHook(() => useFetchUserByIdSwrCore(123));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeUndefined();
  });

  it("should use correct URL with user id", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchUserByIdSwrCore(123));

    expect(useSWR).toHaveBeenCalledWith(
      "/iam/users/123",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should use null URL when user id is null", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchUserByIdSwrCore(null));

    expect(useSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should return user data", () => {
    const mockData = {
      status: 200,
      data: {
        id: 123,
        email: "user@example.com",
        fullName: "Test User",
        roleId: 1,
        role: "ADMIN",
        phone: "123456789",
        address: "123 Test St",
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

    const { result } = renderHook(() => useFetchUserByIdSwrCore(123));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.user).toEqual(mockData.data);
  });

  it("should return error on failed fetch", () => {
    const mockError = new Error("User not found");

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useFetchUserByIdSwrCore(123));

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

    const { result } = renderHook(() => useFetchUserByIdSwrCore(123));

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

    const { result } = renderHook(() => useFetchUserByIdSwrCore(123));

    expect(result.current.isValidating).toBe(true);
  });

  it("should accept custom options", () => {
    const useSWR = require("swr").default;
    const customOptions = {
      refreshInterval: 5000,
    };

    renderHook(() => useFetchUserByIdSwrCore(123, customOptions));

    expect(useSWR).toHaveBeenCalledWith(
      "/iam/users/123",
      expect.any(Function),
      expect.objectContaining({
        refreshInterval: 5000,
      })
    );
  });
});
