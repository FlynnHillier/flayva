import { api } from "@/api/api";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const post = createQueryKeys("post", {
  getPostById: (postId: string) => ({
    queryFn: async () => await api.post.getPostById(postId),
    queryKey: ["post", "getById", postId],
  }),
});
