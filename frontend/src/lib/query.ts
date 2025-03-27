import { NetworkResourceNotFoundError } from "@/lib/network";
import { QueryClient } from "@tanstack/react-query";

/**
 * The maximum number of retries for a query
 */
const QUERY_RETRY_LIMIT = 3;

/**
 * Retry function for react-query
 *
 */
const retry = (failureCount: number, error: Error) => {
  if (error instanceof NetworkResourceNotFoundError) {
    // Do not retry if the error is a 404
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
