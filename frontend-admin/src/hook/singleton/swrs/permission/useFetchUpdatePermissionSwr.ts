/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import useSWRMutation from "swr/mutation";

import { RoleWithPermissions } from "@/types/permission";

import { patchFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface UpdatePermissionPayload {
  permissionIds: number[];
}

export interface UpdatePermissionResponse {
  statusCode: number;
  error: string | null;
  message: string | null;
  data: RoleWithPermissions;
}

export const useFetchUpdatePermissionSwrCore = (
  initialId: string | number | null,
  options?: any
) => {
  const key = "/roles/{id}";

  const mutationFn = async (
    _key: string,
    { arg }: { arg?: { id?: number; payload?: UpdatePermissionPayload } }
  ) => {
    const id = arg?.id ?? initialId;
    if (!id) throw new Error("ID is required to update role permissions");
    const url = _key.replace("{id}", String(id));
    return patchFetcher<UpdatePermissionResponse>(url, {
      arg: arg?.payload ?? { permissionIds: [] },
    });
  };

  const { data, trigger, error, isMutating } = useSWRMutation(
    key,
    mutationFn,
    options
  );

  const updateRolePermissions = async (arg: {
    id?: number;
    payload?: UpdatePermissionPayload;
  }) => {
    return trigger(arg as any);
  };

  return {
    data: data as UpdatePermissionResponse | undefined,
    updateRolePermissions,
    error,
    isMutating,
  };
};

export const useFetchUpdatePermissionSwrSingleton = () => {
  const { useFetchUpdatePermissionSwr } = useContext(SwrContext)!;
  return useFetchUpdatePermissionSwr;
};
