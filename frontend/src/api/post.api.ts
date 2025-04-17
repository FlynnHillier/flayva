import { UnexpectedResponseFormatError } from "@/api/errors/api-errors";
import { request } from "@/lib/network";
import { Post, PostPreview } from "@flayva-monorepo/shared/types";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { z } from "zod";

export async function createNewPost(
  postData: z.infer<typeof createNewPostSchema>
) {
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

export async function searchPost(searchQuery: string) {
  const { data } = await request({
    url: "/api/p/search",
    method: "GET",
    params: { searchQuery },
  });

  return { posts: data } as { posts: Post[] };
}

export async function getPostPreviewsByOwnerId(ownerId: string) {
  const { data } = await request({
    url: `/api/p/owner/${ownerId}`,
    method: "GET",
  });

  return { previews: data } as { previews: PostPreview[] };
}

export async function getInfiniteScrollPostPreviewsByOwnerId(
  ownerId: string,
  cursor: number
) {
  const { data } = await request({
    url: `/api/p/owner/inf/${ownerId}`,
    method: "GET",
    params: { cursor },
  });

  const { previews, nextCursor } = data;

  if (previews === undefined || nextCursor === undefined)
    throw new UnexpectedResponseFormatError(
      "getInfiniteScrollPostPreviewsByOwnerId",
      "previews or nextCursor is missing in the response"
    );

  return { previews, nextCursor } as {
    previews: PostPreview[];
    nextCursor: number | null;
  };
}

export async function getInfiniteScrollPostPreviewsByTitleAndTags(
  title: string,
  selectedTagIds: number[],
  cursor: number
) {
  const { data } = await request({
    url: `/api/p/search/preview`,
    method: "GET",
    params: {
      cursor,
      tag: selectedTagIds,
      title: title,
    },
  });

  const { previews, nextCursor } = data;

  if (previews === undefined || nextCursor === undefined)
    throw new UnexpectedResponseFormatError(
      "getInfiniteScrollPostPreviewsByTitleAndTags",
      "previews or nextCursor is missing in the response"
    );

  return { previews, nextCursor } as {
    previews: PostPreview[];
    nextCursor: number | null;
  };
}

export async function getUserPostsWithTagFilters(
  ownerId: string,
  selectedTags: Record<string, string[]>,
  cursor: number
) {
  const { data } = await request({
    url: `/api/p/user/tags/${ownerId}`,
    method: "GET",
    params: {
      cursor,
      tags: JSON.stringify(selectedTags),
    },
  });

  const { previews, nextCursor } = data;

  if (previews === undefined || nextCursor === undefined)
    throw new UnexpectedResponseFormatError(
      "getUserPostsWithTagFilters",
      "previews or nextCursor is missing in the response"
    );

  return { previews, nextCursor } as {
    previews: PostPreview[];
    nextCursor: number | null;
  };
}
