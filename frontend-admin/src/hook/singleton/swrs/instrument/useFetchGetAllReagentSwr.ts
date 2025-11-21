import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { Reagent } from "@/types/regent";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface GetAllReagentsResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  path?: string | null;
  timestamp?: string | null;
  data: Reagent[];
}

export const useFetchGetAllReagentSwrCore = (
  url: string = "/instrument/reagents/all",
  options?: SWRConfiguration
) => {
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<GetAllReagentsResponse>(url, fetcher<GetAllReagentsResponse>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options,
    });

  return { data, error, isLoading, mutate, isValidating };
};

export const useFetchGetAllReagentSwrSingleton = () => {
  const { useFetchGetAllReagentSwr } = useContext(SwrContext)!;
  return useFetchGetAllReagentSwr;
};
