import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import {
  ScanIdentityCardData,
  ScanIdentityCardResponse,
} from "@/types/identityNumber";

import { postFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export const useFetchCreateIdentityCardSwrCore = (
  url: string = "/iam/users/identity",
  options?: SWRMutationConfiguration<
    ScanIdentityCardResponse,
    Error,
    string,
    ScanIdentityCardData
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    ScanIdentityCardResponse,
    Error,
    string,
    ScanIdentityCardData
  >(url, postFetcher<ScanIdentityCardResponse, ScanIdentityCardData>, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    createIdentityCard: trigger,
    trigger,
    reset,
  };
};

export const useFetchCreateIdentityCardSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchCreateIdentityCardSwrSingleton must be used within SwrProvider"
    );
  }

  const { useFetchCreateIdentityCardSwr } = context;
  return useFetchCreateIdentityCardSwr;
};
