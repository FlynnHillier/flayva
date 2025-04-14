import { createQueryKeys } from "@lukemorales/query-key-factory";
import { api } from "@/api/api";

export const tags = createQueryKeys("tags", {
  getTagList: () => ({
    queryFn: () => api.tags.getTagList(),
    queryKey: ["tags", "list"],
  }),
});
