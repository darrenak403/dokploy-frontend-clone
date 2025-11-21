/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import { useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";

import { UpdateProfilePayload, UpdateProfileResponse } from "@/types/profile";

import { patchFetcher } from "@/libs/fetcher";

import { setUserData } from "@/redux/slices/authSlice";

import { SwrContext } from "../SwrProvider";

export const useFetchUpdateUserSwrCore = (
  initialId: string | number | null,
  options?: any
) => {
  const key = "/iam/users/{id}";

  const mutationFn = async (
    _key: string,
    { arg }: { arg?: { id?: number; payload?: UpdateProfilePayload } }
  ) => {
    const id = arg?.id ?? initialId;
    if (!id) throw new Error("ID is required to update user profile");
    const url = _key.replace("{id}", String(id));
    return patchFetcher<UpdateProfileResponse>(url, {
      arg: arg?.payload ?? {},
    });
  };

  const { data, trigger, error, isMutating } = useSWRMutation(
    key,
    mutationFn,
    options
  );
  const dispatch = useDispatch();

  const updateUserProfile = async (arg: {
    id?: number;
    payload?: UpdateProfilePayload;
  }) => {
    const res = await trigger(arg as any);
    try {
      if (res && res.data) {
        const u = res.data;
        // update only user data in auth slice; keep tokens untouched
        dispatch(
          setUserData({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            role: u.role ?? "",
            address: u.address ?? null,
            gender: u.gender ?? undefined,
            dateOfBirth: u.dateOfBirth ?? null,
            phone: u.phone ?? null,
            avatarUrl: u.avatarUrl ?? null,
          })
        );
      }
    } catch (e) {
      // swallow dispatch errors but still return response
      console.error("Failed to update redux auth state", e);
    }
    return res;
  };

  return {
    data: data as UpdateProfileResponse | undefined,
    updateUserProfile,
    error,
    isMutating,
  };
};

export const useFetchUpdateUserSwrSingleton = () => {
  const { useFetchUpdateUserSwr } = useContext(SwrContext)!;
  return useFetchUpdateUserSwr;
};
