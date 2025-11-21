import { useContext } from "react";

import useSWRMutation from "swr/mutation";
import { SWRMutationConfiguration } from "swr/mutation";

import { deleteFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

interface TestOrderDeleteResponse {
  status?: number;
  message?: string | null;
  data: null;
}

export const useFetchDeleteTestOrderSwrCore = (
  url = "/orders/{id}",
  options?: SWRMutationConfiguration<
    TestOrderDeleteResponse,
    unknown,
    string,
    number | { id?: number }
  >
) => {
  const mutationFn = async (
    key: string,
    { arg }: { arg?: number | { id?: number } }
  ) => {
    const id = typeof arg === "object" ? arg?.id : arg;
    if (!id) throw new Error("Missing id for delete test order");

    const finalUrl = key.includes("{id}")
      ? key.replace("{id}", String(id))
      : `${key}/${id}`;

    return deleteFetcher<TestOrderDeleteResponse>(finalUrl);
  };

  const {
    trigger: deleteTestOrder,
    data,
    error,
    isMutating,
  } = useSWRMutation(url, mutationFn, options);

  return { deleteTestOrder, data, error, isMutating };
};

export const useFetchDeleteTestOrderSwrSingleton = () => {
  const { useFetchDeleteTestOrderSwr } = useContext(SwrContext)!;
  return useFetchDeleteTestOrderSwr;
};
