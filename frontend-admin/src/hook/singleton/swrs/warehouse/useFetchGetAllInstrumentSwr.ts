import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { Instrument } from "@/types/wareHouse";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface GetAllInstrumentsResponse {
  statusCode?: number;
  error?: string | null;
  message?: string | null;
  data: {
    currentPage?: number;
    totalPages?: number;
    pageSize?: number;
    totalItems?: number;
    data: Instrument[];
  };
}

export const useFetchGetAllInstrumentSwrCore = (
  url: string = "/warehouse/instruments",
  options?: SWRConfiguration
) => {
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<GetAllInstrumentsResponse>(url, fetcher<GetAllInstrumentsResponse>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options,
    });

  return { data, error, isLoading, mutate, isValidating };
};

export const useFetchGetAllInstrumentSwrSingleton = () => {
  const { useFetchGetAllInstrumentSwr } = useContext(SwrContext)!;
  return useFetchGetAllInstrumentSwr;
};
