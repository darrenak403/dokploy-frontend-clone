/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import { useDispatch } from "react-redux";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import { UpdateAvatarPayload, UpdateProfileResponse } from "@/types/profile";

import { patchFetcher } from "@/libs/fetcher";

import { setUserData } from "@/redux/slices/authSlice";

import { SwrContext } from "../SwrProvider";

export const useFetchUpdateAvatarUrlSwrCore = (
  _initialId?: string | number | null,
  options?: any
) => {
  // Endpoint is fixed; server will use authenticated user context to update avatar
  const key = "/iam/users/avatar";

  const mutationFn = async (
    _key: string,
    { arg }: { arg?: { payload?: UpdateAvatarPayload } }
  ): Promise<UpdateProfileResponse> => {
    const payload = arg?.payload ?? {};
    // call the fixed endpoint; do not append id
    return patchFetcher<UpdateProfileResponse>(_key, { arg: payload });
  };

  const { data, trigger, error, isMutating } =
    useSWRMutation<UpdateProfileResponse>(key, mutationFn, options);

  const dispatch = useDispatch();

  const updateProfile = async (arg: {
    id?: number;
    payload?: UpdateAvatarPayload;
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
        await mutate(`/iam/users`);
        if (u && u.id != null) {
          await mutate(`/iam/users/${u.id}`);
        }
      }
    } catch (e) {
      // swallow dispatch errors but still return response
      console.error("Failed to update redux auth state", e);
    }
    return res;
  };

  return {
    data: data as UpdateProfileResponse | undefined,
    updateProfile,
    error,
    isMutating,
  };
};

export const useFetchUpdateAvatarUrlSwrSingleton = () => {
  const { useFetchUpdateAvatarUrlSwr } = useContext(SwrContext)!;
  return useFetchUpdateAvatarUrlSwr;
};
