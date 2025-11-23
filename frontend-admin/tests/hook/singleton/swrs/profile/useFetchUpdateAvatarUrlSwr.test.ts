import { renderHook } from "@testing-library/react";

import { useFetchUpdateAvatarUrlSwrCore } from "@/hook/singleton/swrs/profile/useFetchUpdateAvatarUrlSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");
jest.mock("swr");
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

const mockTrigger = jest.fn();
const mockDispatch = jest.fn();
const mockMutate = jest.fn();

describe("useFetchUpdateAvatarUrlSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const { useDispatch } = require("react-redux");
    useDispatch.mockReturnValue(mockDispatch);

    const { mutate } = require("swr");
    mutate.mockImplementation(mockMutate);

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: false,
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchUpdateAvatarUrlSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.updateProfile).toBeDefined();
  });

  it("should use fixed avatar URL", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() => useFetchUpdateAvatarUrlSwrCore());

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/iam/users/avatar",
      expect.any(Function),
      undefined
    );
  });

  it("should call updateProfile with avatar payload", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "ADMIN",
        avatarUrl: "https://example.com/avatar.jpg",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchUpdateAvatarUrlSwrCore());

    await result.current.updateProfile({
      payload: { avatarUrl: "https://example.com/avatar.jpg" },
    });

    expect(mockTrigger).toHaveBeenCalled();
  });

  it("should dispatch setUserData on successful update", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "ADMIN",
        avatarUrl: "https://example.com/avatar.jpg",
        address: "123 Test St",
        gender: "Male",
        dateOfBirth: "1990-01-01",
        phone: "123456789",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchUpdateAvatarUrlSwrCore());

    await result.current.updateProfile({
      payload: { avatarUrl: "https://example.com/avatar.jpg" },
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "auth/setUserData",
        payload: expect.objectContaining({
          id: 1,
          email: "test@example.com",
          fullName: "Test User",
          avatarUrl: "https://example.com/avatar.jpg",
        }),
      })
    );
  });

  it("should mutate related endpoints after update", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "USER",
        avatarUrl: "https://example.com/avatar.jpg",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchUpdateAvatarUrlSwrCore());

    await result.current.updateProfile({
      payload: { avatarUrl: "https://example.com/avatar.jpg" },
    });

    expect(mockMutate).toHaveBeenCalledWith("/iam/users");
    expect(mockMutate).toHaveBeenCalledWith("/iam/users/1");
  });

  it("should return error on failed update", () => {
    const mockError = new Error("Failed to update avatar");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: mockError,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchUpdateAvatarUrlSwrCore());

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

    const { result } = renderHook(() => useFetchUpdateAvatarUrlSwrCore());

    expect(result.current.isMutating).toBe(true);
  });

  it("should accept custom options", () => {
    const useSWRMutation = require("swr/mutation").default;
    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchUpdateAvatarUrlSwrCore(null, customOptions));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/iam/users/avatar",
      expect.any(Function),
      customOptions
    );
  });
});
