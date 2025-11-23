import { renderHook } from "@testing-library/react";

import { useFetchUpdateCommentSwrCore } from "@/hook/singleton/swrs/comments/useFetchUpdateCommentSwr";
import {
  UpdateCommentPayload,
  UpdateCommentResponse,
} from "@/hook/singleton/swrs/comments/useFetchUpdateCommentSwr";

jest.mock("swr/mutation");

describe("useFetchUpdateCommentSwrCore", () => {
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

    const { result } = renderHook(() => useFetchUpdateCommentSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.updateComment).toBeDefined();
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

    renderHook(() => useFetchUpdateCommentSwrCore());

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/comments/update",
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

    const customUrl = "/api/comments/update";
    renderHook(() => useFetchUpdateCommentSwrCore(customUrl));

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      customUrl,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should return updated comment data on success", () => {
    const mockResponse: UpdateCommentResponse = {
      status: 200,
      error: null,
      message: "Comment updated successfully",
      path: "/comments/update",
      timestamp: "2024-01-15T10:30:00.000Z",
      data: {
        commentId: 1,
        content: "Updated comment content",
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

    const { result } = renderHook(() => useFetchUpdateCommentSwrCore());

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.data.content).toBe("Updated comment content");
  });

  it("should handle error when update fails", () => {
    const mockError = new Error("Failed to update comment");

    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: mockError,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchUpdateCommentSwrCore());

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it("should set isMutating to true during update", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: true,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchUpdateCommentSwrCore());

    expect(result.current.isMutating).toBe(true);
  });

  it("should call trigger (updateComment) with correct payload", () => {
    const mockTrigger = jest.fn();
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchUpdateCommentSwrCore());

    const payload: UpdateCommentPayload = {
      commentId: 1,
      content: "Updated content",
    };

    result.current.updateComment(payload);

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

    renderHook(() =>
      useFetchUpdateCommentSwrCore("/comments/update", customOptions)
    );

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/comments/update",
      expect.any(Function),
      expect.objectContaining(customOptions)
    );
  });
});
