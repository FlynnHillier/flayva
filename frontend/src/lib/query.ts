import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

/**
 * The maximum number of retries for a query
 */
const QUERY_RETRY_LIMIT = 2;

/**
 * Which error codes to retry on
 * 5xx errors are retried, but 4xx errors are not retried
 */
const shouldRetryOnAxiosError = (error: AxiosError): boolean =>
  !!error.response?.status && error.response.status > 499;

/**
 * Retry function for react-query
 *
 */
const retry = (failureCount: number, error: Error) => {
  if (error instanceof AxiosError && !shouldRetryOnAxiosError(error)) return false;

  return failureCount < QUERY_RETRY_LIMIT;
};

/**
 * The react-query client instance
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry,
    },
    mutations: {
      retry,
    },
  },
});
