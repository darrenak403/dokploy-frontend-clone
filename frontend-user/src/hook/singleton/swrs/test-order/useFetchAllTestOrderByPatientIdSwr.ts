import { useContext } from "react";

import { useSelector } from "react-redux";
import useSWR, { SWRConfiguration } from "swr";

import { TestOrderResponse } from "@/types/test-order/getAllTestOrderByPatientId";

import { fetcher } from "@/libs/fetcher";

import { RootState } from "@/redux/store";

import { SwrContext } from "../SwrProvider";

export const useFetchAllTestOrderByPatientIdSwrCore = (
  patientId: string | number | null = null,
  options: SWRConfiguration = {}
) => {
  const url = patientId ? `/orders/patient/${patientId}` : null;
  const authState = useSelector((state: RootState) => state.auth);
  const accessToken = authState.data?.accessToken;

  const { data, error, isLoading, mutate, isValidating } =
    useSWR<TestOrderResponse>(url, fetcher<TestOrderResponse>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: !!accessToken,
      ...options,
    });
  return { data, error, isLoading, mutate, isValidating };
};

export const useFetchAllTestOrderByPatientIdSwrSingleton = (
  patientId: string | number | null
) => {
  const { useFetchAllTestOrderByPatientIdSwr } = useContext(SwrContext)!;
  return useFetchAllTestOrderByPatientIdSwr(patientId);
};
