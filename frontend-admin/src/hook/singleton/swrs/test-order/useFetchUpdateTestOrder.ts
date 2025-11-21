/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import useSWRMutation from "swr/mutation";

import {
  UpdateTestOrderPayload,
  UpdateTestOrderResponse,
} from "@/types/test-order";

import { patchFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export const useFetchUpdateTestOrderSwrCore = (
  initialId: string | number | null,
  options?: any
) => {
  const key = "/orders/{id}";

  const mutationFn = async (
    _key: string,
    { arg }: { arg?: { id?: number; payload?: UpdateTestOrderPayload } }
  ) => {
    const id = arg?.id ?? initialId;
    if (!id) throw new Error("ID is required to update test order");
    const url = _key.replace("{id}", String(id));
    return patchFetcher<UpdateTestOrderResponse>(url, {
      arg: arg?.payload ?? {},
    });
  };

  const { data, trigger, error, isMutating } = useSWRMutation(
    key,
    mutationFn,
    options
  );

  const updateTestOrder = async (arg: {
    id?: number;
    payload?: UpdateTestOrderPayload;
  }) => {
    return trigger(arg as any);
  };

  return {
    data: data as UpdateTestOrderResponse | undefined,
    updateTestOrder,
    error,
    isMutating,
  };
};

export const useFetchUpdateTestOrderSwrSingleton = () => {
  const { useFetchUpdateTestOrderSwr } = useContext(SwrContext)!;
  return useFetchUpdateTestOrderSwr;
};
