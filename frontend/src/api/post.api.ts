import { request } from "@/lib/network";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { z } from "zod";

export async function createNewPost(postData: z.infer<typeof createNewPostSchema>) {
  const fd = new FormData();

  postData.images.forEach((image) => {
    fd.append(`images`, image);
  });
  fd.append("recipe", JSON.stringify(postData.recipe));

  const { data, headers, status } = await request({
    url: "/api/p/create",
    method: "POST",
    data: fd,
  });

  return { data, headers, status };
}
