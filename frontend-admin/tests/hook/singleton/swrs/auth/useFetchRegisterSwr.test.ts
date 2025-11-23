import { renderHook, waitFor } from "@testing-library/react";

import { postFetcher } from "@/libs/fetcher";

import {
  RegisterAuthResponse,
  RegisterRequest,
  useFetchRegisterSwrCore,
} from "@/hook/singleton/swrs/auth/useFetchRegisterSwr";

jest.mock("@/libs/fetcher", () => ({
  postFetcher: jest.fn(),
}));

const mockPostFetcher = postFetcher as jest.MockedFunction<typeof postFetcher>;

describe("useFetchRegisterSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRegisterPayload: RegisterRequest = {
    email: "newuser@example.com",
    password: "password123",
    fullName: "New User",
  };

  const mockSuccessResponse: RegisterAuthResponse = {
    status: 200,
    message: "Registration successful",
    data: { userId: 1 },
  };

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchRegisterSwrCore());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.register).toBe("function");
    expect(typeof result.current.setError).toBe("function");
  });

  it("should handle successful registration with status 200", async () => {
    mockPostFetcher.mockResolvedValueOnce(mockSuccessResponse);

    const { result } = renderHook(() => useFetchRegisterSwrCore());

    await waitFor(async () => {
      const response = await result.current.register(mockRegisterPayload);
      expect(response).toEqual(mockSuccessResponse);
    });

    expect(mockPostFetcher).toHaveBeenCalledWith("/auth/register", {
      arg: mockRegisterPayload,
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle successful registration with status 201", async () => {
    const response201 = { ...mockSuccessResponse, status: 201 };
    mockPostFetcher.mockResolvedValueOnce(response201);

    const { result } = renderHook(() => useFetchRegisterSwrCore());

    await waitFor(async () => {
      const response = await result.current.register(mockRegisterPayload);
      expect(response).toEqual(response201);
    });

    expect(result.current.error).toBeNull();
  });

  it("should handle API error with message", async () => {
    const errorMessage = "Email already exists";
    mockPostFetcher.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useFetchRegisterSwrCore());

    await expect(result.current.register(mockRegisterPayload)).rejects.toThrow(
      errorMessage
    );

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  it("should handle non-200/201 status with default error message", async () => {
    const failedResponse = {
      status: 400,
      message: "",
      data: undefined,
    };
    mockPostFetcher.mockResolvedValueOnce(failedResponse);

    const { result } = renderHook(() => useFetchRegisterSwrCore());

    await expect(
      result.current.register(mockRegisterPayload)
    ).rejects.toThrow();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should handle non-200/201 status with custom error message", async () => {
    const failedResponse = {
      status: 400,
      message: "Invalid email format",
      data: undefined,
    };
    mockPostFetcher.mockResolvedValueOnce(failedResponse);

    const { result } = renderHook(() => useFetchRegisterSwrCore());

    await expect(result.current.register(mockRegisterPayload)).rejects.toThrow(
      "Invalid email format"
    );

    await waitFor(() => {
      expect(result.current.error).toBe("Invalid email format");
    });
  });

  it("should handle non-Error exception", async () => {
    mockPostFetcher.mockRejectedValueOnce("Network error");

    const { result } = renderHook(() => useFetchRegisterSwrCore());

    await expect(result.current.register(mockRegisterPayload)).rejects.toBe(
      "Network error"
    );

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
    });
  });

  it("should set loading state correctly during registration", async () => {
    mockPostFetcher.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockSuccessResponse), 100);
        })
    );

    const { result } = renderHook(() => useFetchRegisterSwrCore());

    const registerPromise = result.current.register(mockRegisterPayload);

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await registerPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should handle registration with empty fields", async () => {
    mockPostFetcher.mockResolvedValueOnce(mockSuccessResponse);

    const { result } = renderHook(() => useFetchRegisterSwrCore());

    const emptyPayload: RegisterRequest = {
      email: "",
      password: "",
      fullName: "",
    };

    await waitFor(async () => {
      await result.current.register(emptyPayload);
    });

    expect(mockPostFetcher).toHaveBeenCalledWith("/auth/register", {
      arg: emptyPayload,
    });
  });

  it("should handle response without data field", async () => {
    const responseWithoutData: RegisterAuthResponse = {
      status: 200,
      message: "Success",
    };
    mockPostFetcher.mockResolvedValueOnce(responseWithoutData);

    const { result } = renderHook(() => useFetchRegisterSwrCore());

    await waitFor(async () => {
      const response = await result.current.register(mockRegisterPayload);
      expect(response.data).toBeUndefined();
    });
  });

  it("should handle response with null message", async () => {
    const responseWithNullMessage = {
      status: 400,
      message: null,
      data: undefined,
    };
    mockPostFetcher.mockResolvedValueOnce(responseWithNullMessage);

    const { result } = renderHook(() => useFetchRegisterSwrCore());

    await expect(
      result.current.register(mockRegisterPayload)
    ).rejects.toThrow();
  });
});
