import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { deleteFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface DeleteCommentPayload {
  commentId: number;
}

export interface DeleteCommentResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  path?: string | null;
  timestamp?: string | null;
  data?: {
    action?: string;
    referenceId?: number;
    entityType?: string;
    performedBy?: string;
    reason?: string;
    performedAt?: string;
  };
}

export const useFetchDeleteCommentSwrCore = (
  url: string = "/comments",
  options?: SWRMutationConfiguration<
    DeleteCommentResponse,
    Error,
    string,
    DeleteCommentPayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    DeleteCommentResponse,
    Error,
    string,
    DeleteCommentPayload
  >(url, deleteFetcher<DeleteCommentResponse, DeleteCommentPayload>, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    deleteComment: trigger,
    trigger,
    reset,
  };
};

export const useFetchDeleteCommentSwrSingleton = () => {
  // ✅ Fixed name
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchDeleteCommentSwrSingleton must be used within SwrProvider"
    );
  }

  const { useFetchDeleteCommentSwr } = context;
  return useFetchDeleteCommentSwr;
};
