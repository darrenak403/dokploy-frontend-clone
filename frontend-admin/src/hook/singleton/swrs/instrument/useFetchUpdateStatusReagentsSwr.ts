/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import useSWRMutation from "swr/mutation";

import { patchFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface UpdateReagentStatusPayload {
  reagentStatus: "AVAILABLE" | "OUT_OF_STOCK" | "EXPIRED";
  quantity: number;
}

export interface UpdateReagentStatusResponse {
  status: number;
  error: string | null;
  message: string | null;
  path: string | null;
  timestamp: string | null;
  data: {
    reagentName: string;
    oldStatus: string;
    newStatus: string;
    oldQuantity: number;
    newQuantity: number;
    updatedBy: string;
    action: string;
    timestamp: string;
  };
}

export const useFetchUpdateStatusReagentsSwrCore = (
  initialReagentId: string | number | null,
  options?: any
) => {
  const key = "/instrument/reagents/{reagentId}";

  const mutationFn = async (
    _key: string,
    {
      arg,
    }: {
      arg?: {
        reagentId?: string | number;
        payload?: UpdateReagentStatusPayload;
      };
    }
  ) => {
    const reagentId = arg?.reagentId ?? initialReagentId;
    if (!reagentId) {
      throw new Error("Reagent ID is required to update status");
    }
    const url = _key.replace("{reagentId}", String(reagentId));
    return patchFetcher<UpdateReagentStatusResponse>(url, {
      arg: arg?.payload ?? {},
    });
  };

  const { data, trigger, error, isMutating } = useSWRMutation(
    key,
    mutationFn,
    options
  );

  const updateReagentStatus = async (arg: {
    reagentId?: string | number;
    payload?: UpdateReagentStatusPayload;
  }) => {
    return trigger(arg as any);
  };

  return {
    data: data as UpdateReagentStatusResponse | undefined,
    updateReagentStatus,
    error,
    isMutating,
  };
};

export const useFetchUpdateStatusReagentsSwrSingleton = () => {
  const { useFetchUpdateStatusReagentsSwr } = useContext(SwrContext)!;
  return useFetchUpdateStatusReagentsSwr;
};
