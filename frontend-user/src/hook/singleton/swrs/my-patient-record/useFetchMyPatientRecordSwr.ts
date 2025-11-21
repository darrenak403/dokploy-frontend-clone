import { useContext } from "react";

import { useSelector } from "react-redux";
import useSWR, { SWRConfiguration } from "swr";

import { MyPatientRecordResponse } from "@/types/my-record/getMyPatientRecord";

import { fetcher } from "@/libs/fetcher";

import { RootState } from "@/redux/store";

import { SwrContext } from "../SwrProvider";

export const useFetchMyPatientRecordSwrCore = (
  url: string = "/patient/me",
  options?: SWRConfiguration
) => {
  const authState = useSelector((state: RootState) => state.auth);
  const accessToken = authState.data?.accessToken;

  const { data, error, isLoading, mutate, isValidating } =
    useSWR<MyPatientRecordResponse>(url, fetcher<MyPatientRecordResponse>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: false,
      revalidateOnMount: !!accessToken,
      ...options,
    });
  return { data, error, isLoading, mutate, isValidating };
};

export const useFetchMyPatientRecordSwrSingleton = () => {
  const { useFetchMyPatientRecordSwr } = useContext(SwrContext)!;
  return useFetchMyPatientRecordSwr;
};
