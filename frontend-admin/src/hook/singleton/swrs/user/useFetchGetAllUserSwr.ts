import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { User } from "@/types/profile";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface GetAllUsersResponse {
  status?: number;
  message?: string | null;
  data: User[];
}

export const useFetchGetAllUserSwrCore = (
  url: string = "/iam/users",
  options?: SWRConfiguration
) => {
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<GetAllUsersResponse>(url, fetcher<GetAllUsersResponse>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options,
    });

  return { data, error, isLoading, mutate, isValidating };
};

export const useFetchGetAllUserSwrSingleton = () => {
  const { useFetchGetAllUserSwr } = useContext(SwrContext)!;
  return useFetchGetAllUserSwr;
};
