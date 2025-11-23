import { renderHook } from "@testing-library/react";

import { useFetchCreateUserSwrCore } from "@/hook/singleton/swrs/user/useFetchCreateUserSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");

const mockTrigger = jest.fn();

describe("useFetchCreateUserSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: false,
      reset: jest.fn(),
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchCreateUserSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.createUser).toBeDefined();
  });

  it("should use default URL", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() => useFetchCreateUserSwrCore());

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/iam/users",
      expect.any(Function),
      expect.objectContaining({})
    );
  });

  it("should call createUser with payload", async () => {
    const { result } = renderHook(() => useFetchCreateUserSwrCore());

    const payload = {
      email: "newuser@example.com",
      password: "password123",
      fullName: "New User",
      phone: "123456789",
      roleId: 2,
    };

    await result.current.createUser(payload);

    expect(mockTrigger).toHaveBeenCalledWith(payload);
  });

  it("should return data on successful creation", () => {
    const mockData = {
      status: 201,
      message: "User created successfully",
      data: {
        id: 1,
        email: "newuser@example.com",
        fullName: "New User",
        roleId: 2,
        role: "USER",
      },
    };

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: mockData,
      error: undefined,
      isMutating: false,
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateUserSwrCore());

    expect(result.current.data).toEqual(mockData);
  });

  it("should return error on failed creation", () => {
    const mockError = new Error("Email already exists");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: mockError,
      isMutating: false,
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateUserSwrCore());

    expect(result.current.error).toEqual(mockError);
  });

  it("should show isMutating during creation", () => {
    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: true,
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateUserSwrCore());

    expect(result.current.isMutating).toBe(true);
  });

  it("should have reset function", () => {
    const mockReset = jest.fn();

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: false,
      reset: mockReset,
    });

    const { result } = renderHook(() => useFetchCreateUserSwrCore());

    expect(result.current.reset).toBeDefined();
  });

  it("should accept custom options", () => {
    const useSWRMutation = require("swr/mutation").default;
    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchCreateUserSwrCore("/iam/users", customOptions));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/iam/users",
      expect.any(Function),
      expect.objectContaining({
        onSuccess: customOptions.onSuccess,
        onError: customOptions.onError,
      })
    );
  });
});
