import { renderHook } from "@testing-library/react";

import { useFetchUpdateProfileSwrCore } from "@/hook/singleton/swrs/profile/useFetchUpdateProfile";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");
jest.mock("swr");
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

const mockTrigger = jest.fn();
const mockDispatch = jest.fn();
const mockMutate = jest.fn();

describe("useFetchUpdateProfileSwrCore", () => {
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
    const { result } = renderHook(() => useFetchUpdateProfileSwrCore(123));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.updateProfile).toBeDefined();
  });

  it("should use initialId when not provided in trigger", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 123,
        email: "test@example.com",
        fullName: "Test User",
        role: "ADMIN",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchUpdateProfileSwrCore(123));

    await result.current.updateProfile({
      payload: {
        email: "test@example.com",
        fullName: "Updated Name",
      },
    });

    expect(mockTrigger).toHaveBeenCalled();
  });

  it("should accept id in trigger argument", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 456,
        email: "test@example.com",
        fullName: "Updated User",
        role: "USER",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchUpdateProfileSwrCore(null));

    await result.current.updateProfile({
      id: 456,
      payload: {
        email: "test@example.com",
        fullName: "Updated User",
      },
    });

    expect(mockTrigger).toHaveBeenCalled();
  });

  it("should dispatch setUserData on successful update", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 123,
        email: "test@example.com",
        fullName: "Test User",
        role: "ADMIN",
        address: "123 Test St",
        gender: "Male",
        dateOfBirth: "1990-01-01",
        phone: "123456789",
        avatarUrl: "https://example.com/avatar.jpg",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchUpdateProfileSwrCore(123));

    await result.current.updateProfile({
      payload: {
        email: "test@example.com",
        fullName: "Test User",
      },
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "auth/setUserData",
        payload: expect.objectContaining({
          id: 123,
          email: "test@example.com",
          fullName: "Test User",
        }),
      })
    );
  });

  it("should mutate related endpoints after update", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 123,
        email: "test@example.com",
        fullName: "Test User",
        role: "USER",
      },
    };

    mockTrigger.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchUpdateProfileSwrCore(123));

    await result.current.updateProfile({
      payload: {
        email: "test@example.com",
        fullName: "Test User",
      },
    });

    expect(mockMutate).toHaveBeenCalledWith("/iam/users");
    expect(mockMutate).toHaveBeenCalledWith("/iam/users/123");
  });

  it("should return error on failed update", () => {
    const mockError = new Error("Failed to update profile");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: mockError,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchUpdateProfileSwrCore(123));

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

    const { result } = renderHook(() => useFetchUpdateProfileSwrCore(123));

    expect(result.current.isMutating).toBe(true);
  });

  it("should accept custom options", () => {
    const useSWRMutation = require("swr/mutation").default;
    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchUpdateProfileSwrCore(123, customOptions));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/iam/users/{id}",
      expect.any(Function),
      customOptions
    );
  });
});
