import { request } from "@/lib/network";
import { Post } from "@flayva-monorepo/shared/types";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { z } from "zod";

export async function createNewPost(postData: z.infer<typeof createNewPostSchema>) {
  const fd = new FormData();

  postData.images.forEach((image) => {
    fd.append(`images`, image);
  });
  fd.append("recipe", JSON.stringify(postData.recipe));

  const { data } = await request({
    url: "/api/p/create",
    method: "POST",
    data: fd,
  });

  const { postId, recipeId } = data as {
    postId: Post["id"];
    recipeId: Post["recipeId"];
  };

  return {
    postId,
    recipeId,
  };
}

export async function deleteExistingPost(postId: string) {
  const { data } = await request({
    url: "/api/p/delete",
    method: "DELETE",
    data: { postId },
  });

  return data as { deleted?: boolean; message: string };
}

export async function getPostById(postId: string) {
  const { data } = await request({
    url: `/api/p/${postId}`,
    method: "GET",
  });

  return { post: data } as { post: Post | null };
}
