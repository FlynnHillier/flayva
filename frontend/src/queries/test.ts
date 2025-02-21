import { createQueryKeys } from "@lukemorales/query-key-factory";

import { api } from "@/api/api";

export const test = createQueryKeys("test", {
  hello: () => ({
    queryFn: () => api.test.hello(),
    queryKey: ["hello"],
  }),
});
