import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import {
  CreateTestOrderPayload,
  CreateTestOrderResponse,
} from "@/types/test-order";

import { postFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export const useFetchCreateTestOrderSwrCore = (
  url: string = "/orders",
  options?: SWRMutationConfiguration<
    CreateTestOrderResponse,
    Error,
    string,
    CreateTestOrderPayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    CreateTestOrderResponse,
    Error,
    string,
    CreateTestOrderPayload
  >(url, postFetcher<CreateTestOrderResponse, CreateTestOrderPayload>, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    createTestOrder: trigger,
    trigger,
    reset,
  };
};

export const useFetchCreateTestOrderSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchCreateTestOrderSwrSingleton must be used within SwrProvider"
    );
  }

  const { useFetchCreateTestOrderSwr } = context;
  return useFetchCreateTestOrderSwr;
};
