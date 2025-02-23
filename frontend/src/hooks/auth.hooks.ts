import { api } from "@/api/api";
import { queryClient } from "@/lib/query";
import { queries } from "@queries/index";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Fetches the current user
 */
export function useMe() {
  return useQuery(queries.auth.me());
}

/**
 * Logs the user out
 */
export function useLogout() {
  return useMutation({
    mutationFn: async () => await api.auth.logout(),
    mutationKey: ["auth", "logout"],
    onSuccess: () => {
      queryClient.invalidateQueries(queries.auth.me()); // Refetch the user data
    },
  });
}
