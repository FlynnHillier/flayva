import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

/**
 * A custom error class for queries that should not be retried
 */
export class NoRetryQueryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

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
  if (
    error instanceof NoRetryQueryError ||
    (error instanceof AxiosError && !shouldRetryOnAxiosError(error))
  )
    return false;

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

/**
 * Sets the query data for a given query
 * @param query - The query object containing the query key and function
 * @param updater - The updater function to modify the old data
 */
export function setQueryData<
  T extends {
    queryKey: readonly unknown[];
    queryFn: (...args: any[]) => Promise<any> | any;
  }
>(
  query: T,
  updater: (
    old: Awaited<ReturnType<T["queryFn"]>> | undefined
  ) => Awaited<ReturnType<T["queryFn"]>> | undefined
): void {
  queryClient.setQueryData(query.queryKey, updater);
}

/**
 * Sets the query data for an infinite query
 * @param query - The query object containing the query key and function
 * @param updater - The updater function to modify the old data
 */
export function setInfiniteQueryData<
  T extends {
    queryKey: readonly unknown[];
    queryFn: (...args: any[]) => Promise<any> | any;
  }
>(
  query: T,
  updater: ({}: {
    pages: Awaited<ReturnType<T["queryFn"]>>[];
    pageParams: number[];
  }) => { pages: Awaited<ReturnType<T["queryFn"]>>[]; pageParams: number[] }
): void {
  queryClient.setQueryData(query.queryKey, updater);
}
