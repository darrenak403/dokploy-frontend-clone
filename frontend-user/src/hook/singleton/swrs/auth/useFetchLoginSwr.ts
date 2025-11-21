import { useContext, useState } from "react";

import { postFetcher } from "@/libs/fetcher";

import { setAuth } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";

import { SwrContext } from "../SwrProvider";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: number;
      email: string;
      fullName: string;
      role: string;
      address: string | null;
      gender: string | undefined;
      dateOfBirth: string | null;
      phone: string | null;
      avatarUrl: string | null;
    };
  };
  path: string | null;
  timestamp: string | null;
}

export const useFetchLoginSwrCore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginRequest) => {
    setLoading(true);
    try {
      const result = await postFetcher<LoginResponse, LoginRequest>(
        "/auth/login",
        { arg: payload }
      );
      console.log("Login response:", result);
      if (result.status === 200 || result.status === 201) {
        store.dispatch(
          setAuth({
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
            id: result.data.user.id,
            email: result.data.user.email,
            fullName: result.data.user.fullName,
            role: result.data.user.role,
            address: result.data.user.address,
            gender: result.data.user.gender,
            dateOfBirth: result.data.user.dateOfBirth,
            phone: result.data.user.phone,
            avatarUrl: result.data.user.avatarUrl,
          })
        );
      }
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, setError };
};

export const useFetchLoginSwrSingleton = () => {
  const { useFetchLoginSwr } = useContext(SwrContext)!;
  return useFetchLoginSwr;
};
