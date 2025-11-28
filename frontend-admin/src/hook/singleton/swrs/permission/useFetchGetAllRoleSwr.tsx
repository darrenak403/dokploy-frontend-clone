import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { RoleWithPermissions } from "@/types/permission";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface GetAllRolesResponse {
  statusCode: number;
  error: string | null;
  message: string | null;
  data: RoleWithPermissions[];
}

export const useFetchGetAllRoleCore = (
  url: string = "/roles",
  options?: SWRConfiguration
) => {
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<GetAllRolesResponse>(url, fetcher<GetAllRolesResponse>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options,
    });

  return { data, error, isLoading, mutate, isValidating };
};

export const useFetchGetAllRoleSingleton = () => {
  const { useFetchGetAllRoleSwr } = useContext(SwrContext)!;
  return useFetchGetAllRoleSwr;
};
