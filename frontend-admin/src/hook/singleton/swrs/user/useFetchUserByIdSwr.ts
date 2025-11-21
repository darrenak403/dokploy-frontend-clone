import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { User } from "@/types/profile";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface UserByIdResponse {
  status?: number;
  message?: string | null;
  data: User;
}

export const useFetchUserByIdSwrCore = (
  userId: string | number | null,
  options?: SWRConfiguration
) => {
  const url = userId ? `/iam/users/${userId}` : null;

  const { data, error, isLoading, mutate, isValidating } =
    useSWR<UserByIdResponse>(url, fetcher<UserByIdResponse>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options,
    });

  return {
    data,
    error,
    isLoading,
    mutate,
    isValidating,
    user: data?.data,
  };
};

export const useFetchUserByIdSwrSingleton = (
  userId: string | number | null
) => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchUserByIdSwrSingleton must be used within SwrProvider"
    );
  }

  return useFetchUserByIdSwrCore(userId);
};
