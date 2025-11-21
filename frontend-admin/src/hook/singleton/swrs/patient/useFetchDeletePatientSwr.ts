import { useContext } from "react";

import useSWRMutation from "swr/mutation";
import { SWRMutationConfiguration } from "swr/mutation";

import { deleteFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

interface PatientDeleteResponse {
  status?: number;
  message?: string | null;
  data: null;
}

export const useFetchDeletePatientSwrCore = (
  url = "/patient/{id}",
  options?: SWRMutationConfiguration<
    PatientDeleteResponse,
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
    if (!id) throw new Error("Missing id for delete patient");

    const finalUrl = key.includes("{id}")
      ? key.replace("{id}", String(id))
      : `${key}/${id}`;

    return deleteFetcher<PatientDeleteResponse>(finalUrl);
  };

  const {
    trigger: deletePatient,
    data,
    error,
    isMutating,
  } = useSWRMutation(url, mutationFn, options);

  return { deletePatient, data, error, isMutating };
};

export const useFetchDeletePatientSwrSingleton = () => {
  const { useFetchDeletePatientSwr } = useContext(SwrContext)!;
  return useFetchDeletePatientSwr;
};
