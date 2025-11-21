/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import useSWRMutation from "swr/mutation";

import { Instrument } from "@/types/wareHouse";

import { putFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface UpdateInstrumentPayload {
  status: string;
}

export interface UpdateInstrumentResponse {
  statusCode?: number;
  error?: string | null;
  message?: string | null;
  data?: Instrument;
}

export const useFetchUpdateInstrumentSwrCore = (
  initialId: string | number | null,
  options?: any
) => {
  const key = "/warehouse/instruments/{id}";

  const mutationFn = async (
    _key: string,
    { arg }: { arg?: { id?: number; payload?: UpdateInstrumentPayload } }
  ) => {
    const id = arg?.id ?? initialId;
    if (!id) throw new Error("ID is required to update instrument");
    const url = _key.replace("{id}", String(id));
    return putFetcher<UpdateInstrumentResponse>(url, {
      arg: arg?.payload ?? {},
    });
  };

  const { data, trigger, error, isMutating } = useSWRMutation(
    key,
    mutationFn,
    options
  );

  const updateInstrument = async (arg: {
    id?: number;
    payload?: UpdateInstrumentPayload;
  }) => {
    return trigger(arg as any);
  };

  return {
    data: data as UpdateInstrumentResponse | undefined,
    updateInstrument,
    error,
    isMutating,
  };
};

export const useFetchUpdateInstrumentSwrSingleton = () => {
  const { useFetchUpdateInstrumentSwr } = useContext(SwrContext)!;
  return useFetchUpdateInstrumentSwr;
};
