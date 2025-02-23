import { queries } from "@queries/index";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches the current user
 */
export function useMe() {
  return useQuery(queries.auth.me());
}
