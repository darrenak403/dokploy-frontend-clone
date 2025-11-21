import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { TestResult } from "@/types/test-result";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export const useFetchGetTestResultSwrCore = (
  accessionNumber: string | null,
  options?: SWRConfiguration
) => {
  const url = accessionNumber ? `/results/${accessionNumber}` : null;

  const { data, error, isLoading, mutate, isValidating } = useSWR<TestResult>(
    url,
    fetcher<TestResult>,
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
    result: data?.data,
  };
};

export const useFetchGetTestResultSwrSingleton = (
  accessionNumber: string | null
) => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchGetTestResultSwrSingleton must be used within SwrProvider"
    );
  }

  return useFetchGetTestResultSwrCore(accessionNumber);
};
