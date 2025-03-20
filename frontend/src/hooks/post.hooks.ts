import { api } from "@/api/api";
import { createConfigurableMutation } from "@/hooks/util/configurableMutation";

export const useCreateNewPost = createConfigurableMutation(
  api.post.createNewPost,
  ["posts", "create"],
  {}
);
