import { renderHook, waitFor } from "@testing-library/react";
import { useDispatch } from "react-redux";

import { postFetcher } from "@/libs/fetcher";

import { setAuth } from "@/redux/slices/authSlice";

import {
  LoginRequest,
  LoginResponse,
  useFetchLoginSwrCore,
} from "@/hook/singleton/swrs/auth/useFetchLoginSwr";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("@/libs/fetcher", () => ({
  postFetcher: jest.fn(),
}));

jest.mock("@/redux/slices/authSlice", () => ({
  setAuth: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockPostFetcher = postFetcher as jest.MockedFunction<typeof postFetcher>;
const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;

describe("useFetchLoginSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  const mockLoginPayload: LoginRequest = {
    email: "test@example.com",
    password: "password123",
  };

  const mockLoginResponse: LoginResponse = {
    status: 200,
    message: "Login successful",
    data: {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: {
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "role_admin",
        address: "123 Test Street",
        gender: "male",
        dateOfBirth: "01/01/1990",
        phone: "0123456789",
        avatarUrl: "https://example.com/avatar.jpg",
      },
    },
    path: "/auth/login",
    timestamp: "2024-01-01T00:00:00Z",
  };

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchLoginSwrCore());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.login).toBe("function");
    expect(typeof result.current.setError).toBe("function");
  });

  it("should handle successful login with status 200", async () => {
    mockPostFetcher.mockResolvedValueOnce(mockLoginResponse);

    const { result } = renderHook(() => useFetchLoginSwrCore());

    await waitFor(async () => {
      const response = await result.current.login(mockLoginPayload);
      expect(response).toEqual(mockLoginResponse);
    });

    expect(mockPostFetcher).toHaveBeenCalledWith("/auth/login", {
      arg: mockLoginPayload,
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setAuth({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "role_admin",
        address: "123 Test Street",
        gender: "male",
        dateOfBirth: "01/01/1990",
        phone: "0123456789",
        avatarUrl: "https://example.com/avatar.jpg",
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle successful login with status 201", async () => {
    const response201 = { ...mockLoginResponse, status: 201 };
    mockPostFetcher.mockResolvedValueOnce(response201);

    const { result } = renderHook(() => useFetchLoginSwrCore());

    await waitFor(async () => {
      const response = await result.current.login(mockLoginPayload);
      expect(response).toEqual(response201);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it("should handle login with user having null fields", async () => {
    const responseWithNulls: LoginResponse = {
      ...mockLoginResponse,
      data: {
        ...mockLoginResponse.data,
        user: {
          ...mockLoginResponse.data.user,
          address: null,
          gender: null,
          dateOfBirth: null,
          phone: null,
          avatarUrl: null,
        },
      },
    };

    mockPostFetcher.mockResolvedValueOnce(responseWithNulls);

    const { result } = renderHook(() => useFetchLoginSwrCore());

    await waitFor(async () => {
      await result.current.login(mockLoginPayload);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setAuth({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "role_admin",
        address: null,
        gender: null,
        dateOfBirth: null,
        phone: null,
        avatarUrl: null,
      })
    );
  });

  it("should handle API error", async () => {
    const errorMessage = "Invalid credentials";
    mockPostFetcher.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useFetchLoginSwrCore());

    await expect(result.current.login(mockLoginPayload)).rejects.toThrow(
      errorMessage
    );

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  it("should handle non-Error exception", async () => {
    mockPostFetcher.mockRejectedValueOnce("String error");

    const { result } = renderHook(() => useFetchLoginSwrCore());

    await expect(result.current.login(mockLoginPayload)).rejects.toBe(
      "String error"
    );

    await waitFor(() => {
      expect(result.current.error).toBe("String error");
    });
  });

  it("should set loading state correctly during login", async () => {
    mockPostFetcher.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockLoginResponse), 100);
        })
    );

    const { result } = renderHook(() => useFetchLoginSwrCore());

    const loginPromise = result.current.login(mockLoginPayload);

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await loginPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should not dispatch setAuth if status is not 200 or 201", async () => {
    const response400 = { ...mockLoginResponse, status: 400 };
    mockPostFetcher.mockResolvedValueOnce(response400);

    const { result } = renderHook(() => useFetchLoginSwrCore());

    await waitFor(async () => {
      const response = await result.current.login(mockLoginPayload);
      expect(response.status).toBe(400);
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("should handle empty email and password", async () => {
    mockPostFetcher.mockResolvedValueOnce(mockLoginResponse);

    const { result } = renderHook(() => useFetchLoginSwrCore());

    const emptyPayload: LoginRequest = {
      email: "",
      password: "",
    };

    await waitFor(async () => {
      await result.current.login(emptyPayload);
    });

    expect(mockPostFetcher).toHaveBeenCalledWith("/auth/login", {
      arg: emptyPayload,
    });
  });
});
