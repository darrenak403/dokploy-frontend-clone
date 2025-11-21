import { useContext, useState } from "react";

import { postFetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterAuthResponse {
  status: number;
  data?: unknown;
  message: string;
}

export const useFetchRegisterSwrCore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    payload: RegisterRequest
  ): Promise<RegisterAuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const url = "/auth/register";

      const result = await postFetcher<RegisterAuthResponse, RegisterRequest>(
        url,
        { arg: payload }
      );

      if (result.status === 200 || result.status === 201) {
        return result;
      }

      const msg = result?.message ?? "Đăng ký thất bại";
      throw new Error(msg);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, setError };
};

export const useFetchRegisterSwrSingleton = () => {
  const { useFetchRegisterSwr } = useContext(SwrContext)!;
  return useFetchRegisterSwr;
};
