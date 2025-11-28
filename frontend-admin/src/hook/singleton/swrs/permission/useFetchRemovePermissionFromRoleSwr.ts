import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { deleteFetcher } from "@/libs/fetcher";

import { SwrContext } from "../..";

export interface RemovePermissionFromRoleResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  data: null;
}

export const useFetchRemovePermissionFromRoleSwrCore = (
  url: string = "/iam/roles/permissions",
  options?: SWRMutationConfiguration<
    RemovePermissionFromRoleResponse,
    Error,
    string,
    { roleId: number; permissionId: number }
  >
) => {
  const mutationFn = async (
    key: string,
    { arg }: { arg: { roleId: number; permissionId: number } }
  ) => {
    const { roleId, permissionId } = arg;
    if (!roleId || !permissionId) {
      throw new Error("Missing roleId or permissionId for removing permission");
    }

    const url = new URL(key, window.location.origin);
    url.searchParams.append("roleId", String(roleId));
    url.searchParams.append("permissionId", String(permissionId));
    const finalUrl = url.pathname + url.search;

    return deleteFetcher<RemovePermissionFromRoleResponse>(finalUrl);
  };

  const {
    trigger: removePermissionFromRole,
    data,
    error,
    isMutating,
  } = useSWRMutation(url, mutationFn, options);

  return { removePermissionFromRole, data, error, isMutating };
};

export const useFetchRemovePermissionFromRoleSwrSingleton = () => {
  const { useFetchRemovePermissionFromRoleSwr } = useContext(SwrContext)!;
  return useFetchRemovePermissionFromRoleSwr;
};
