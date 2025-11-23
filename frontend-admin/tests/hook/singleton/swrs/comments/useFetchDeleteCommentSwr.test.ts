import { renderHook } from "@testing-library/react";

import { useFetchDeleteCommentSwrCore } from "@/hook/singleton/swrs/comments/useFetchDeleteCommentSwr";
import {
  DeleteCommentPayload,
  DeleteCommentResponse,
} from "@/hook/singleton/swrs/comments/useFetchDeleteCommentSwr";

jest.mock("swr/mutation");

describe("useFetchDeleteCommentSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchDeleteCommentSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.trigger).toBeDefined();
    expect(result.current.reset).toBeDefined();
  });

  it("should use correct default URL", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    renderHook(() => useFetchDeleteCommentSwrCore());

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/comments",
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should accept custom URL", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const customUrl = "/api/comments";
    renderHook(() => useFetchDeleteCommentSwrCore(customUrl));

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      customUrl,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should return delete response on successful deletion", () => {
    const mockResponse: DeleteCommentResponse = {
      status: 200,
      error: null,
      message: "Comment deleted successfully",
      path: "/comments",
      timestamp: "2024-01-15T10:30:00.000Z",
      data: {
        action: "delete",
        referenceId: 1,
        entityType: "comment",
        performedBy: "admin",
        reason: "User requested deletion",
        performedAt: "2024-01-15T10:30:00.000Z",
      },
    };

    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: mockResponse,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchDeleteCommentSwrCore());

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.data?.action).toBe("delete");
  });

  it("should handle error when deletion fails", () => {
    const mockError = new Error("Failed to delete comment");

    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: mockError,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchDeleteCommentSwrCore());

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it("should set isMutating to true during deletion", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: true,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchDeleteCommentSwrCore());

    expect(result.current.isMutating).toBe(true);
  });

  it("should call trigger with correct payload", () => {
    const mockTrigger = jest.fn();
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchDeleteCommentSwrCore());

    const payload: DeleteCommentPayload = {
      commentId: 1,
    };

    result.current.trigger(payload);

    expect(mockTrigger).toHaveBeenCalledWith(payload);
  });

  it("should accept custom SWR options", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchDeleteCommentSwrCore("/comments", customOptions));

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/comments",
      expect.any(Function),
      expect.objectContaining(customOptions)
    );
  });
});
