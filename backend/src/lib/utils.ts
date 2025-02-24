import { env } from "@/env";

/**
 * Create a URL for the client
 * @param path - the path to append to the client origin
 */
export function createClientURL(path: string): string {
  return new URL(path, env.CLIENT_ORIGIN).toString();
}
