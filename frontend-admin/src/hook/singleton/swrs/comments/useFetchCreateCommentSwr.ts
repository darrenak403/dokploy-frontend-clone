import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { Comment } from "@/types/test-result";

import { postFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface CommentPayload {
  testResultId?: number;
  content?: string;
}

// API Response interface
export interface CommentResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  path?: string | null;
  timestamp?: string | null;
  data: Comment;
}

export const useFetchCreateCommentSwrCore = (
  url: string = "/comments",
  options?: SWRMutationConfiguration<
    CommentResponse,
    Error,
    string,
    CommentPayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    CommentResponse,
    Error,
    string,
    CommentPayload
  >(url, postFetcher<CommentResponse, CommentPayload>, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    createComment: trigger,
    trigger,
    reset,
  };
};

export const useFetchCreateCommentSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchCreateCommentSwrSingleton must be used within SwrProvider"
    );
  }

  const { useFetchCreateCommentSwr } = context;
  return useFetchCreateCommentSwr;
};
