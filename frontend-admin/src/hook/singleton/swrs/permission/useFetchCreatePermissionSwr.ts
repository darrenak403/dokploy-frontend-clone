import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { postFetcher } from "@/libs/fetcher";

import { SwrContext } from "../..";

export interface CreatePermissionPayload {
  name: string;
  description?: string;
}

export interface CreatePermissionResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  data: {
    id: number;
    name: string;
    description?: string;
  };
}

export const useFetchCreatePermissionSwrCore = (
  url: string = "/roles/permissions",
  option?: SWRMutationConfiguration<
    CreatePermissionResponse,
    Error,
    string,
    CreatePermissionPayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    CreatePermissionResponse,
    Error,
    string,
    CreatePermissionPayload
  >(url, postFetcher<CreatePermissionResponse, CreatePermissionPayload>, {
    ...option,
  });

  return {
    data,
    error,
    isMutating,
    createPermission: trigger,
    trigger,
    reset,
  };
};

export const useFetchCreatePermissionSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchCreatePermissionSwrSingleton must be used within a SwrProvider"
    );
  }

  const { useFetchCreatePermissionSwr } = context;
  return useFetchCreatePermissionSwr;
};
