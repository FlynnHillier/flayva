import { api } from "@/api/api";
import { createConfigurableMutation } from "@/hooks/util/configurableMutation";

export const useCreateNewPost = createConfigurableMutation(
  api.post.createNewPost,
  ["posts", "create"],
  {}
);

export const useDeleteExistingPost = (postId: string) =>
  createConfigurableMutation(
    async () => await api.post.deleteExistingPost(postId),
    ["posts", "delete", postId],
    {}
  );

export const useGetPostById = (postId: string) =>
  createConfigurableMutation(
    async () => await api.post.getPostById(postId),
    ["posts", "get", postId],
    {}
  );
