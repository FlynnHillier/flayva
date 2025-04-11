import { createQueryKeys } from "@lukemorales/query-key-factory";

import { api } from "@/api/api";

export const auth = createQueryKeys("auth", {
  me: () => ({
    queryFn: () => api.auth.getMe(),
    queryKey: ["auth", "me"],
  }),
  logout: () => ({
    queryFn: () => api.auth.logout(),
    queryKey: ["auth", "logout"],
  }),
});
