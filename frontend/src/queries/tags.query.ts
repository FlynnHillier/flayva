import { createQueryKeys } from "@lukemorales/query-key-factory";

import { api } from "@/api/api";

export const tags = createQueryKeys("tags", {
  fetchTags: () => ({
    queryFn: () => api.tags.fetchTags(), 
    queryKey: ["tags", "all"], 
  }),
});
