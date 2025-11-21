import { useContext } from "react";

import { useSelector } from "react-redux";
import useSWR, { SWRConfiguration } from "swr";

import { ScanIdentityCardResponse } from "@/types/identityNumber";

import { fetcher } from "@/libs/fetcher";

import { RootState } from "@/redux/store";

import { SwrContext } from "../SwrProvider";

export const useFetchGetIdentitySwrCore = (
  url: string = "/iam/users/identity",
  options?: SWRConfiguration
) => {
  const authState = useSelector((state: RootState) => state.auth);
  const accessToken = authState.data?.accessToken;

  const { data, error, isLoading, mutate, isValidating } =
    useSWR<ScanIdentityCardResponse>(url, fetcher<ScanIdentityCardResponse>, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: false,
      revalidateOnMount: !!accessToken,
      ...options,
    });

  return { data, error, isLoading, mutate, isValidating };
};

export const useFetchGetIdentitySwrSingleton = () => {
  const { useFetchGetIdentitySwr } = useContext(SwrContext)!;
  return useFetchGetIdentitySwr;
};
