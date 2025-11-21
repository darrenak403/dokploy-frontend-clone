import { useContext, useState } from "react";

import { useDispatch } from "react-redux";

import { postFetcher } from "@/libs/fetcher";

import { setAuth } from "@/redux/slices/authSlice";

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
      gender: string | null;
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
  const dispatch = useDispatch();

  const login = async (payload: LoginRequest) => {
    setLoading(true);
    try {
      const result = await postFetcher<LoginResponse, LoginRequest>(
        "/auth/login",
        { arg: payload }
      );

      // console.log("🚀 Login API response:", result);

      if (result.status === 200 || result.status === 201) {
        const authPayload = {
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
        };

        // console.log("📤 Dispatching setAuth with payload:", authPayload);

        dispatch(setAuth(authPayload));

        // Kiểm tra state sau khi dispatch
        // setTimeout(() => {
        // const currentState = store.getState().auth;
        // console.log("📥 Current Redux auth state:", currentState);
        // console.log("📥 Redux state after dispatch:", store.getState().auth);
        // }, 100);
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
