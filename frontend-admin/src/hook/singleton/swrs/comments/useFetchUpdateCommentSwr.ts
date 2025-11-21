import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { CommentUpdate } from "@/types/test-result";

import { putFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface UpdateCommentPayload {
  commentId: number;
  content?: string;
}

// API Response interface
export interface UpdateCommentResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  path?: string | null;
  timestamp?: string | null;
  data: CommentUpdate;
}

export const useFetchUpdateCommentSwrCore = (
  url: string = "/comments/update",
  options?: SWRMutationConfiguration<
    UpdateCommentResponse,
    Error,
    string,
    UpdateCommentPayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    UpdateCommentResponse,
    Error,
    string,
    UpdateCommentPayload
  >(url, putFetcher<UpdateCommentResponse, UpdateCommentPayload>, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    updateComment: trigger,
    trigger,
    reset,
  };
};

export const useFetchUpdateCommentSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchUpdateCommentSwrSingleton must be used within SwrProvider"
    );
  }

  const { useFetchUpdateCommentSwr } = context;
  return useFetchUpdateCommentSwr;
};
