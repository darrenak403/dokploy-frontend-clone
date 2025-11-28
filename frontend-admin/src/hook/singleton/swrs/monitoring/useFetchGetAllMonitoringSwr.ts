import { useContext } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { Monitoring } from "@/types/monitoring";

import { fetcher } from "@/libs/fetcher";

import { SwrContext } from "../SwrProvider";

export const useFetchGetAllMonitoringSwrCore = (
  url: string = "/monitoring/api/monitorings",
  options?: SWRConfiguration
) => {
<<<<<<< HEAD
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<Monitoring[]>(url, fetcher<Monitoring[]>, {
=======
  const { data, error, isLoading, mutate, isValidating } = useSWR<Monitoring[]>(
    url,
    fetcher<Monitoring[]>,
    {
>>>>>>> 706ea9b95546c6814000ecbbd6afdf4667f0da2f
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5000, // Auto refresh every 5 seconds for monitoring
      ...options,
<<<<<<< HEAD
    });
=======
    }
  );
>>>>>>> 706ea9b95546c6814000ecbbd6afdf4667f0da2f

  return { data, error, isLoading, mutate, isValidating };
};

export const useFetchGetAllMonitoringSwrSingleton = () => {
  const { useFetchGetAllMonitoringSwr } = useContext(SwrContext)!;
  return useFetchGetAllMonitoringSwr;
};
