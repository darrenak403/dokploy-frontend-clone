import { renderHook } from "@testing-library/react";

import { useFetchCreateCommentSwrCore } from "@/hook/singleton/swrs/comments/useFetchCreateCommentSwr";
import {
  CommentPayload,
  CommentResponse,
} from "@/hook/singleton/swrs/comments/useFetchCreateCommentSwr";

jest.mock("swr/mutation");

describe("useFetchCreateCommentSwrCore", () => {
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

    const { result } = renderHook(() => useFetchCreateCommentSwrCore());

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

    renderHook(() => useFetchCreateCommentSwrCore());

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
    renderHook(() => useFetchCreateCommentSwrCore(customUrl));

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      customUrl,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should return comment data on successful creation", () => {
    const mockCommentResponse: CommentResponse = {
      status: 201,
      error: null,
      message: "Comment created successfully",
      path: "/comments",
      timestamp: "2024-01-15T10:00:00.000Z",
      data: {
        commentId: 1,
        commentContent: "This is a test comment",
        testResultId: 10,
        doctorName: "John Doe",
        createdAt: "2024-01-15T10:00:00.000Z",
        testOrderId: 5,
      },
    };

    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: mockCommentResponse,
      error: undefined,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateCommentSwrCore());

    expect(result.current.data).toEqual(mockCommentResponse);
    expect(result.current.data?.data.commentContent).toBe(
      "This is a test comment"
    );
    expect(result.current.data?.data.testResultId).toBe(10);
  });

  it("should handle error when creation fails", () => {
    const mockError = new Error("Failed to create comment");

    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: mockError,
      isMutating: false,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateCommentSwrCore());

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it("should set isMutating to true during creation", () => {
    const mockUseSWRMutation = require("swr/mutation").default;
    mockUseSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: true,
      trigger: jest.fn(),
      reset: jest.fn(),
    });

    const { result } = renderHook(() => useFetchCreateCommentSwrCore());

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

    const { result } = renderHook(() => useFetchCreateCommentSwrCore());

    const payload: CommentPayload = {
      testResultId: 10,
      content: "New comment content",
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

    renderHook(() => useFetchCreateCommentSwrCore("/comments", customOptions));

    expect(mockUseSWRMutation).toHaveBeenCalledWith(
      "/comments",
      expect.any(Function),
      expect.objectContaining(customOptions)
    );
  });
});
