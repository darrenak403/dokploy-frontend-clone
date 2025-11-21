/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import useSWRMutation from "swr/mutation";

import { deleteFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface DeleteReagentResponse {
  status: number;
  error: string | null;
  message: string | null;
  path: string | null;
  timestamp: string | null;
  data: {
    reagentId: string;
    reagentName: string;
    lotNumber: string;
    deletedBy: string;
    action: string;
    deletedAt: string;
  };
}

export const useFetchDeleteReagentSwrCore = (
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
      };
    }
  ) => {
    const reagentId = arg?.reagentId ?? initialReagentId;
    if (!reagentId) {
      throw new Error("Reagent ID is required to delete reagent");
    }
    const url = _key.replace("{reagentId}", String(reagentId));
    return deleteFetcher<DeleteReagentResponse>(url);
  };

  const { data, trigger, error, isMutating } = useSWRMutation(
    key,
    mutationFn,
    options
  );

  const deleteReagent = async (arg: { reagentId?: string | number }) => {
    return trigger(arg as any);
  };

  return {
    data: data as DeleteReagentResponse | undefined,
    deleteReagent,
    error,
    isMutating,
  };
};

export const useFetchDeleteReagentSwrSingleton = () => {
  const { useFetchDeleteReagentSwr } = useContext(SwrContext)!;
  return useFetchDeleteReagentSwr;
};
