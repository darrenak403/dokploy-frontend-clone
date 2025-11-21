import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { Role } from "@/types/roles";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface GetAllRolesResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  data: Role[];
}

export const useFetchGetAllRoleSwrCore = (
  url: string = "/iam/roles",
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

export const useFetchGetAllRoleSwrSingleton = () => {
  const { useFetchGetAllRoleSwr } = useContext(SwrContext)!;
  return useFetchGetAllRoleSwr;
};
