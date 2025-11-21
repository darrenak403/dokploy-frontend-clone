import { useContext } from "react";

import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

import { User } from "@/types/profile";

import { postFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface CreateUserPayload {
  email: string;
  password?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  gender?: "male" | "female" | "other" | string;
  dateOfBirth?: string;
  roleId?: number;
}

// API Response interface
export interface CreateUserResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  data: User;
}

export const useFetchCreateUserSwrCore = (
  url: string = "/iam/users",
  options?: SWRMutationConfiguration<
    CreateUserResponse,
    Error,
    string,
    CreateUserPayload
  >
) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation<
    CreateUserResponse,
    Error,
    string,
    CreateUserPayload
  >(url, postFetcher<CreateUserResponse, CreateUserPayload>, {
    ...options,
  });

  return {
    data,
    error,
    isMutating,
    createUser: trigger,
    trigger,
    reset,
  };
};

export const useFetchCreateUserSwrSingleton = () => {
  const context = useContext(SwrContext);

  if (!context) {
    throw new Error(
      "useFetchCreateUserSwrSingleton must be used within SwrProvider"
    );
  }

  const { useFetchCreateUserSwr } = context;
  return useFetchCreateUserSwr;
};
