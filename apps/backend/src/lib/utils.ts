import { env } from "@/env";

/**
 * Create a URL for the client
 * @param path - the path to append to the client origin
 */
export function createClientURL(path: string): string {
  return new URL(path, env.CLIENT_ORIGIN).toString();
}

/**
 * Conditionally return a development or production error message
 * @param dev - the error message to return in development
 * @param prod - the error message to return in production
 */
export function devErrorMessage(
  dev: string,
  prod: string = "Something unexpected happened"
): string {
  return env.NODE_ENV === "development" ? dev : prod;
}
