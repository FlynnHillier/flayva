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
 * Get a list of post previews by the title and tags with infinite scroll
 * @param recipeTitle - The search query
 * @param selectedTags - Object containing selected tags by category
 * @param cursor - The cursor for pagination
 * @return A list of post previews and the next cursor for pagination
 */
export const infiniteScrollTitleAndTagsPostPreviews = async (
  recipeTitle: string,
  selectedTags: Record<string, string[]>,
  cursor: number
) => {
  const recipes = await recipeRepo.searchRecipesByTitleAndTags(
    recipeTitle,
    selectedTags,
    cursor
  );

  if (recipes.previews.length === 0) return {
    previews: [],
    nextCursor: null
  };

  const posts = await postRepo.getPostsById(recipes.previews.map(obj => obj.id));

  return {
    previews: posts,
    nextCursor: recipes.nextCursor
  };
};


// Get the list of tags
export const getTagList = async () => {
  const posts = await postRepo.getTagList();

  return posts;
};

/**
 * Get posts by owner ID filtered by tags
 * @param ownerId - The ID of the user who owns the posts
 * @param selectedTags - Object containing selected tags by category
 * @param cursor - The cursor for pagination
 */
export const getUserPostsWithTagFilters = async (
  ownerId: string,
  selectedTags: Record<string, string[]>,
  cursor: number
) => {
  // First get all recipe IDs for this user
  const userPosts = await postRepo.getPostsByOwnerId(ownerId, {
    limit: 1000, // Large limit to get all posts
    columns: {
      recipeId: true
    }
  });
  
  const recipeIds = userPosts.map(post => post.recipeId);
  
  if (recipeIds.length === 0) {
    return {
      previews: [],
      nextCursor: null
    };
  }
  
  // Convert the selectedTags object to a flat array of tag names
  const selectedTagNames = Object.values(selectedTags).flat();
  
  // If no tags are selected, just return all user posts with pagination
  if (selectedTagNames.length === 0) {
    return infiniteScrollProfilePostPreviews(ownerId, cursor);
  }
  
  // Get tag IDs for the selected tag names
  const tagIds = await db
    .select({ id: tags.id })
    .from(tags)
    .where(inArray(tags.name, selectedTagNames));
  
  const tagIdArray = tagIds.map(t => t.id);
  
  // Find recipes that belong to the user AND have any of the selected tags
  const filteredRecipeIds = await db
    .select({ id: recipes.id })
    .from(recipes)
    .leftJoin(recipe_tags, eq(recipes.id, recipe_tags.recipeID))
    .where(
      and(
        inArray(recipes.id, recipeIds),
        inArray(recipe_tags.tagID, tagIdArray)
      )
    )
    .groupBy(recipes.id);
  
  if (filteredRecipeIds.length === 0) {
    return {
      previews: [],
      nextCursor: null
    };
  }
  
  // Get the posts for these recipes with pagination
  const limit = POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE;
  const offset = cursor * limit;
  
  const filteredPosts = await postRepo.getPostsById(
    filteredRecipeIds.map(r => r.id),
    {
      limit: limit + 1,
      offset: offset,
      orderBy: ({ created_at }, { desc }) => desc(created_at)
    }
  );
  
  const hasMore = filteredPosts.length > limit;
  const posts = hasMore ? filteredPosts.slice(0, limit) : filteredPosts;
  
  return {
    previews: posts,
    nextCursor: hasMore ? cursor + 1 : null
  };
};



export default {
  createNewPost,
  getPostById,
  getFeed,
  deletePost,
  infiniteScrollProfilePostPreviews,
  infiniteScrollTitleAndTagsPostPreviews,
  getTagList
};
