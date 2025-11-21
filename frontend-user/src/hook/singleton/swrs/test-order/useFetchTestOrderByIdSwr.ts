import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { TestOrder } from "@/types/test-order";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export const useFetchTestOrderByIdSwrCore = (
  testOrderId: string | number | null,
  options?: SWRConfiguration
) => {
  const url = testOrderId ? `/orders/${testOrderId}` : null;

  const { data, error, isLoading, mutate, isValidating } = useSWR<TestOrder>(
    url,
    fetcher<TestOrder>,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
    isValidating,
    testOrder: data,
  };
};

export const useFetchTestOrderByIdSwrSingleton = (
  testOrderId: string | number | null
) => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchTestOrderByIdSwrSingleton must be used within SwrProvider"
    );
  }

  return useFetchTestOrderByIdSwrCore(testOrderId);
};
