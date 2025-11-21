/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import useSWRMutation from "swr/mutation";

import { patchFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface UpdatePatientPayload {
  userId: number | undefined;
  fullName: string;
  yob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

export interface UpdatePatientResponse {
  statusCode?: number;
  error?: string | null;
  message?: string | null;
  data?: {
    id?: number;
    userId?: number;
    fullName?: string;
    yob?: string;
    gender?: string;
    address?: string;
    phone?: string;
    email?: string;
    createdBy?: string;
    createdAt?: string;
    modifiedBy?: string;
  };
}

export const useFetchUpdatePatientSwrCore = (
  initialId: string | number | null,
  options?: any
) => {
  const key = "/patient/{id}";

  const mutationFn = async (
    _key: string,
    { arg }: { arg?: { id?: number; payload?: UpdatePatientPayload } }
  ) => {
    const id = arg?.id ?? initialId;
    if (!id) throw new Error("ID is required to update patient");
    const url = _key.replace("{id}", String(id));
    return patchFetcher<UpdatePatientResponse>(url, {
      arg: arg?.payload ?? {},
    });
  };

  const { data, trigger, error, isMutating } = useSWRMutation(
    key,
    mutationFn,
    options
  );

  const updatePatient = async (arg: {
    id?: number;
    payload?: UpdatePatientPayload;
  }) => {
    return trigger(arg as any);
  };

  return {
    data: data as UpdatePatientResponse | undefined,
    updatePatient,
    error,
    isMutating,
  };
};

export const useFetchUpdatePatientSwrSingleton = () => {
  const { useFetchUpdatePatientSwr } = useContext(SwrContext)!;
  return useFetchUpdatePatientSwr;
};
