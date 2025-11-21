"use client";
import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import {
  ScanIdentityCardRequest,
  ScanIdentityCardResponse,
} from "@/types/identityNumber";

import { postFormDataFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export const useFetchScanIdentityCardSwrCore = (
  url: string = "/iam/users/extract-id-card",
  options?: SWRMutationConfiguration<
    ScanIdentityCardResponse,
    Error,
    string,
    ScanIdentityCardRequest
  >
) => {
  const mutationFn = async (
    _key: string,
    { arg }: { arg?: ScanIdentityCardRequest }
  ): Promise<ScanIdentityCardResponse> => {
    if (!arg?.formData) {
      throw new Error("formData with frontImage and backImage is required");
    }
    return postFormDataFetcher<ScanIdentityCardResponse>(_key, {
      arg: arg.formData,
    });
  };

  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    ScanIdentityCardResponse,
    Error,
    string,
    ScanIdentityCardRequest
  >(url, mutationFn, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    scanIdentityCard: trigger,
    trigger,
    reset,
  };
};

export const useFetchScanIdentityCardSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchScanIdentityCardSwrSingleton must be used within SwrProvider"
    );
  }

  const ctx = context as unknown as Record<string, unknown>;
  return ctx.useFetchScanIdentityCardSwr as ReturnType<
    typeof useFetchScanIdentityCardSwrCore
  >;
};
