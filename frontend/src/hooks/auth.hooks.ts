import { api } from "@/api/api";
import { createConfigurableMutation } from "@/hooks/util/configurableMutation";
import { queryClient } from "@/lib/query";
import { queries } from "@queries/index";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches the current user
 */
export function useMe() {
  return useQuery(queries.auth.me());
}

/**
 * Logs the user out
 */
export const useLogout = createConfigurableMutation(api.auth.logout, ["auth", "logout"], {
  onSuccess: () => {
    queryClient.invalidateQueries(queries.auth.me());
  },
});
