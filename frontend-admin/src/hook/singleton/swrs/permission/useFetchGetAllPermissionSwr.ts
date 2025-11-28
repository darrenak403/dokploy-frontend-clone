import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { Permission } from "@/types/permission";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface GetAllPermissionsResponse {
  statusCode: number;
  error: string | null;
  message: string | null;
  data: Permission[];
}

export const useFetchGetAllPermissionSwrCore = (
  url: string = "/roles/permissions",
  options?: SWRConfiguration
) => {
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<GetAllPermissionsResponse>(url, fetcher<GetAllPermissionsResponse>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options,
    });

  return { data, error, isLoading, mutate, isValidating };
};

export const useFetchGetAllPermissionSwrSingleton = () => {
  const { useFetchGetAllPermissionSwr } = useContext(SwrContext)!;
  return useFetchGetAllPermissionSwr;
};
