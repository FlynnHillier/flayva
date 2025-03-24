import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

/**
 * The maximum number of retries for a query
 */
const QUERY_RETRY_LIMIT = 3;

/**
 * Retry function for react-query
 *
 */
const retry = (failureCount: number, error: Error) => {
  if (error instanceof AxiosError && error.response?.status === 404) {
    console.log("404 not retrying!");
    return false;
  }

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
