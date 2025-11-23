import { renderHook } from "@testing-library/react";

import { useFetchUpdateUserSwrCore } from "@/hook/singleton/swrs/user/useFetchUpdateUserSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

const mockTrigger = jest.fn();
const mockDispatch = jest.fn();

describe("useFetchUpdateUserSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const { useDispatch } = require("react-redux");
    useDispatch.mockReturnValue(mockDispatch);

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: false,
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchUpdateUserSwrCore(123));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.updateUserProfile).toBeDefined();
  });

  it("should use initialId when not provided in trigger", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 123,
        email: "user@example.com",
        fullName: "Test User",
        role: "USER",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchUpdateUserSwrCore(123));

    await result.current.updateUserProfile({
      payload: { email: "user@example.com", fullName: "Test User" },
    });

    expect(mockTrigger).toHaveBeenCalled();
  });

  it("should accept id in trigger argument", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 456,
        email: "user2@example.com",
        fullName: "Updated User",
        role: "ADMIN",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchUpdateUserSwrCore(null));

    await result.current.updateUserProfile({
      id: 456,
      payload: { email: "user2@example.com", fullName: "Updated User" },
    });

    expect(mockTrigger).toHaveBeenCalled();
  });

  it("should dispatch setUserData on successful update", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 123,
        email: "user@example.com",
        fullName: "Test User",
        role: "USER",
        address: "123 Test St",
        gender: "Male",
        dateOfBirth: "1990-01-01",
        phone: "123456789",
        avatarUrl: "https://example.com/avatar.jpg",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchUpdateUserSwrCore(123));

    await result.current.updateUserProfile({
      payload: { email: "user@example.com", fullName: "Test User" },
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "auth/setUserData",
        payload: expect.objectContaining({
          id: 123,
          email: "user@example.com",
          fullName: "Test User",
        }),
      })
    );
  });

  it("should return error on failed update", () => {
    const mockError = new Error("Failed to update user");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: mockError,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchUpdateUserSwrCore(123));

    expect(result.current.error).toEqual(mockError);
  });

  it("should show isMutating during update", () => {
    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: true,
    });

    const { result } = renderHook(() => useFetchUpdateUserSwrCore(123));

    expect(result.current.isMutating).toBe(true);
  });

  it("should accept custom options", () => {
    const useSWRMutation = require("swr/mutation").default;
    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchUpdateUserSwrCore(123, customOptions));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/iam/users/{id}",
      expect.any(Function),
      customOptions
    );
  });

  it("should handle dispatch error gracefully", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 123,
        email: "user@example.com",
        fullName: "Test User",
        role: "USER",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);
    mockDispatch.mockImplementation(() => {
      throw new Error("Dispatch error");
    });

    const { result } = renderHook(() => useFetchUpdateUserSwrCore(123));

    const res = await result.current.updateUserProfile({
      payload: { email: "user@example.com", fullName: "Test User" },
    });

    expect(res).toEqual(mockResponse);
  });
});
