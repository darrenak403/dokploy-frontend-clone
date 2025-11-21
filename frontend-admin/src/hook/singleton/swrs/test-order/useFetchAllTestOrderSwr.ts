import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { TestOrder } from "@/types/test-order";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface TestOrderListResponse {
  status?: number;
  message?: string | null;
  data: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    // normalize to `list` for UI consumption; server may still return `testOrders`
    list: TestOrder[];
    // keep optional legacy field for mapping
    testOrders?: TestOrder[];
  };
}

export const useFetchAllTestOrderSwrCore = (
  url: string = "/orders",
  options?: SWRConfiguration
) => {
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<TestOrderListResponse>(url, fetcher<TestOrderListResponse>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options,
    });
  // normalize response so consumers always read `data.data.list`
  const normalized = data
    ? {
        ...data,
        data: {
          ...data.data,
          list: data.data.list ?? data.data.testOrders ?? [],
        },
      }
    : data;

  return { data: normalized, error, isLoading, mutate, isValidating };
};

export const useFetchAllTestOrderSwrSingleton = () => {
  const { useFetchAllTestOrderSwr } = useContext(SwrContext)!;
  return useFetchAllTestOrderSwr;
};
