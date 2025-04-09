import { POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE } from "@/constants/posts.constants";
import postRepo from "@/server/repositories/post.repo";
import recipeRepo from "../repositories/recipe.repo";
import { uploadPostImages } from "@/server/services/images.services";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { z } from "zod";

/**
 * Create a new post
 *
 * @param ownerId - The ID of the user creating the post
 * @param newPostData - The data for the new post
 */
export const createNewPost = async (
  ownerId: string,
  newPostData: z.infer<typeof createNewPostSchema>
) => {
  // TODO: handle upload image failures
  const { successes: imageUploads } = await uploadPostImages(newPostData.images);

  const { postId, recipeId } = await postRepo.saveNewPost(ownerId, {
    imageUploads: imageUploads,
    recipe: newPostData.recipe,
  });

  return { postId, recipeId };
};

export const deletePost = async (postId: string) => {
  const isDeleted = await postRepo.deleteExistingPost(postId);

  return {
    deleted: isDeleted,
  };
};

/**
 * Get a post by its ID
 * @param postId - The ID of the post to get
 * @returns The post with the given ID
 */
export const getPostById = async (postId: string) => {
  //TODO: process db response

  const post = await postRepo.getPostById(postId);

  return post;
};

/**
 * Get a list of post previews by the owner ID with infinite scroll
 * @param ownerId - The ID of the owner
 * @param cursor - The cursor for pagination
 * @return A list of post previews and the next cursor for pagination
 */
export const infiniteScrollProfilePostPreviews = async (ownerId: string, cursor: number) => {
  const results = await postRepo.getPostPreviewsByOwnerId(ownerId, {
    limit: POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE,
    offset: cursor,
    orderBy: ({ created_at }, { desc }) => desc(created_at),
  });

  return {
    previews: results,
    nextCursor:
      results.length < POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE
        ? null
        : cursor + POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE,
  };
};

export const getPostsByOwnerId = (ownerId: string) => postRepo.getPostsByOwnerId(ownerId);

/**
 * Get a feed of posts
 *
 */
export const getFeed = async () => {
  const posts = await postRepo.getRecentPosts(5);

  return posts;
};

/**
 * Get a list of post previews by the title with infinite scroll
 * @param recipeTitle - The search query
 * @param cursor - The cursor for pagination
 * @return A list of post previews and the next cursor for pagination
 */
export const infiniteScrollTitlePostPreviews = async (
	recipeTitle: string,
	cursor: number
) => {
	const recipes = await recipeRepo.searchRecipesByTitle(
		recipeTitle,
		cursor
	);

  console.log({recipes})

  if (recipes.previews.length == 0) return {
    previews: [],
    nextCursor: null
  }

  const posts = await postRepo.getPostsById(recipes.previews.map(obj => obj.id))

	return {
    previews: posts,
    nextCursor: recipes.nextCursor
  };
};

export default {
  createNewPost,
  getPostById,
  getFeed,
  deletePost,
  infiniteScrollProfilePostPreviews,
  infiniteScrollTitlePostPreviews,
};
