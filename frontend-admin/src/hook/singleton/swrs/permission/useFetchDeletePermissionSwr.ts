import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { deleteFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface DeletePermissionResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  data: null;
}

export const useFetchDeletePermissionSwrCore = (
  url: string = "/roles/permissions/{permissionId}",
  options?: SWRMutationConfiguration<
    DeletePermissionResponse,
    Error,
    string,
    number | { permissionId?: number }
  >
) => {
  const mutationFn = async (
    key: string,
    { arg }: { arg?: number | { permissionId?: number } }
  ) => {
    const id = typeof arg === "object" ? arg?.permissionId : arg;
    if (!id) throw new Error("Missing id for delete permission");

    const finalUrl = key.includes("{permissionId}")
      ? key.replace("{permissionId}", String(id))
      : `${key}/${id}`;

    return deleteFetcher<DeletePermissionResponse>(finalUrl);
  };

  const {
    trigger: deletePermission,
    data,
    error,
    isMutating,
  } = useSWRMutation(url, mutationFn, options);

  return { deletePermission, data, error, isMutating };
};

export const useFetchDeletePermissionSwrSingleton = () => {
  const { useFetchDeletePermissionSwr } = useContext(SwrContext)!;
  return useFetchDeletePermissionSwr;
};
