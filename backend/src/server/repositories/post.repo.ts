import { db } from "@/db";
import {
  post_images,
  post_likes,
  posts,
  recipe_ingredients,
  recipe_instruction_steps,
  recipe_meta_infos,
  recipe_ratings,
  recipe_tags,
  recipes,
} from "@/db/schema";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { z } from "zod";
import { UploadedFileData } from "uploadthing/types";
import { DbFindManyParams } from "@/types/db.types";
import { eq, and } from "drizzle-orm";
import { NestedRepositoryObject } from "@/types/api.types";

/**
 * MANAGING POSTS
 */

/**
 * Save a new post to the database
 *
 * @param ownerId - The ID of the user creating the post
 * @param imageUploads - The uploaded images for the post
 */
export const saveNewPost = (
  ownerId: string,
  {
    imageUploads,
    recipe: recipeData,
  }: {
    imageUploads: UploadedFileData[];
    recipe: z.infer<typeof createNewPostSchema>["recipe"];
  }
) =>
  db.transaction(async (tx) => {
    const [recipe] = await tx
      .insert(recipes)
      .values({
        title: recipeData.title,
        description: recipeData.description,
      })
      .returning();

    const [post] = await tx
      .insert(posts)
      .values({
        ownerId: ownerId,
        recipeId: recipe.id,
      })
      .returning();

    const insertIngredientsPromise =
      recipeData.ingredients.length === 0
        ? Promise.resolve()
        : tx.insert(recipe_ingredients).values(
            recipeData.ingredients.map((ingredient) => ({
              recipe_id: recipe.id,
              ingredient_id: ingredient.id,
              amount_whole: ingredient.amount.whole,
              amount_fractional_numerator:
                ingredient.amount.fractional?.numerator,
              amount_fractional_denominator:
                ingredient.amount.fractional?.denominator,
              unit: ingredient.unit,
            }))
          );

    const insertTagsPromise =
      recipeData.tags.length === 0
        ? Promise.resolve()
        : tx.insert(recipe_tags).values(
            recipeData.tags.map((tag) => ({
              recipeID: recipe.id,
              tagID: tag.tagId,
            }))
          );

    const insertInstructionsPromise =
      recipeData.instructions.length === 0
        ? Promise.resolve()
        : tx.insert(recipe_instruction_steps).values(
            recipeData.instructions.map((instruction, i) => ({
              recipeId: recipe.id,
              stepNumber: i,
              instruction: instruction.instruction,
            }))
          );

    const insertMetaInfoPromise = tx.insert(recipe_meta_infos).values({
      recipeId: recipe.id,
      estimatedCookTime: recipeData.metaInfo?.cookTime?.toString(),
      estimatedPrepTime: recipeData.metaInfo?.prepTime?.toString(),
      servings: recipeData.metaInfo?.servings,
    });

    const insertImageReferencesPromise =
      imageUploads.length === 0
        ? Promise.resolve()
        : tx
            .insert(post_images)
            .values(
              imageUploads.map((image) => ({ key: image.key, postID: post.id }))
            );

    await Promise.all([
      insertIngredientsPromise,
      insertTagsPromise,
      insertInstructionsPromise,
      insertMetaInfoPromise,
      insertImageReferencesPromise,
    ]);

    return {
      postId: post.id,
      recipeId: recipe.id,
    };
  });

/**
 * delete an existing post from the database
 * @param postId - The ID of the post to delete
 * @returns true if the post was deleted, false if it was not found
 */
export const deleteExistingPost = async (postId: string) => {
  //TODO: currently recipes are not deleted when a post is deleted - revisit this when we decide if we are implementing forking or not

  const [deleted] = await db
    .delete(posts)
    .where(eq(posts.id, postId))
    .returning()
    .execute();

  return !!deleted;
};

/**
 * POST PREVIEWS
 */

/**
 * Get post previews from the database
 *
 * @param options query options to dictate which posts to fetch
 * @returns post previews
 */
export const getPostPreviews = (
  options: Omit<DbFindManyParams<"posts">, "with" | "columns">
) =>
  db.query.posts.findMany({
    columns: {
      id: true,
      recipeId: true,
      created_at: true,
    },
    with: {
      images: {
        columns: {
          key: true,
        },
      },
      recipe: {
        columns: {
          id: true,
          title: true,
          description: true,
        },
      },
      owner: {
        columns: {
          id: true,
          username: true,
          profile_picture_url: true,
        },
      },
    },
    ...options,
  });

/**
 * Get post previews by owner ID
 * @param ownerId - The ID of the user who owns the posts
 * @param options - query options to dictate which posts to fetch
 */
export const getPostPreviewsByOwnerId = (
  ownerId: string,
  options: Omit<Parameters<typeof getPostPreviews>[0], "where">
) =>
  getPostPreviews({
    where: (posts, { eq }) => eq(posts.ownerId, ownerId),
    ...options,
  });

/**
 * GETTING POSTS
 */

/**
 * Get posts from the database
 *
 * @param options query options to dictate which posts to fetch
 */
export const getPosts = (
  options: Omit<DbFindManyParams<"posts">, "with" | "columns">
) =>
  db.query.posts
    .findMany({
      columns: {
        id: true,
        recipeId: true,
        created_at: true,
      },
      with: {
        owner: {
          columns: {
            updatedAt: false,
            createdAt: false,
          },
        },
        images: {
          columns: {
            key: true,
          },
        },
        recipe: {
          with: {
            ratings: {
              with: {},
              columns: {
                rating: true,
                review: true,
              },
            },
            tagLinks: {
              with: {
                tag: {
                  columns: {
                    category: true,
                    group: true,
                    id: true,
                    name: true,
                  },
                },
              },
            },
            instructions: {
              columns: {
                instruction: true,
                stepNumber: true,
              },
            },
            ingredients: {
              columns: {
                amount_fractional_denominator: true,
                amount_fractional_numerator: true,
                amount_whole: true,
                unit: true,
              },
              with: {
                ingredientItem: {
                  columns: {
                    group: true,
                    id: true,
                    name: true,
                    subgroup: true,
                  },
                },
              },
            },
            metaInfo: {
              columns: {
                estimatedCookTime: true,
                estimatedPrepTime: true,
                servings: true,
              },
            },
          },
        },
      },
      ...options,
      extras: {
        ...options.extras,
        likeCount: db.$count(post_likes).mapWith(Number).as("likeCount"), //TODO: mapwith is not working
      },
    })
    .execute();

/**
 * Get a post by its ID
 * @param postId - The ID of the post to fetch
 * @param options - query options to dictate which posts to fetch
 */
export const getPostsById = (
  postId: string,
  options: Omit<Parameters<typeof getPosts>[0], "where"> = {}
) => getPosts({ ...options, where: (posts, { eq }) => eq(posts.id, postId) });

/**
 * Get a post by its ID
 * @param postId - The ID of the post to fetch
 * @param options - query options to dictate which posts to fetch
 */
export const getPostById = async (
  postId: string,
  options: Omit<Parameters<typeof getPostsById>[1], "limit"> = {}
) => {
  const posts = await getPostsById(postId, { limit: 1, ...options });

  if (posts.length === 0) return null;

  return posts[0];
};

/**
 * Get the most recent posts
 * @param limit - The number of posts to fetch
 *
 */
export const getRecentPosts = async (limit: number) => {
  const posts = await getPosts({
    limit,
    orderBy: (posts, { desc }) => desc(posts.created_at),
  });

  return posts;
};

/**
 * Get posts by owner ID
 * @param ownerId - The ID of the user who owns the posts
 * @param options - query options to dictate which posts to fetch
 */
export const getPostsByOwnerId = (
  ownerId: string,
  options: Omit<Parameters<typeof getPosts>[0], "where"> = {}
) =>
  getPosts({
    where: (posts, { eq }) => eq(posts.ownerId, ownerId),
    ...options,
  });

/**
 *
 *
 * INTERACTIONS
 *
 *
 */
export const interactions = {
  /**
   * Handle like interactions for posts
   */
  like: {
    status: async (postId: string, userId: string) => {
      const [liked] = await db
        .select()
        .from(post_likes)
        .where(
          and(eq(post_likes.postID, postId), eq(post_likes.userID, userId))
        )
        .execute();

      return liked as typeof liked | undefined;
    },
    add: async (postId: string, userId: string) => {
      const [liked] = await db
        .insert(post_likes)
        .values({
          postID: postId,
          userID: userId,
        })
        .onConflictDoNothing()
        .returning();

      return liked as typeof liked | undefined;
    },
    remove: async (postId: string, userId: string) => {
      const [deleted] = await db
        .delete(post_likes)
        .where(
          and(eq(post_likes.postID, postId), eq(post_likes.userID, userId))
        )
        .returning()
        .execute();

      return deleted as typeof deleted | undefined;
    },
    toggle: async (postId: string, userId: string) => {
      const [liked] = await db
        .insert(post_likes)
        .values({
          postID: postId,
          userID: userId,
        })
        .onConflictDoNothing()
        .returning();

      if (liked) {
        // if the insert was successful, it means the user liked the post
        return {
          added: true,
          entry: liked,
        };
      }

      // if the insert was not successful, it means the user already liked the post
      // so we need to delete the like
      const [deleted] = await db
        .delete(post_likes)
        .where(
          and(eq(post_likes.postID, postId), eq(post_likes.userID, userId))
        )
        .returning()
        .execute();

      if (deleted)
        return {
          removed: true,
          entry: deleted,
        };

      return { entry: null };
    },
  },
} satisfies NestedRepositoryObject;

export const createPostLikeInteraction = (userId: string, postId: string) =>
  db
    .insert(post_likes)
    .values({
      postID: postId,
      userID: userId,
    })
    .onConflictDoNothing()
    .returning();

/**
 * Default export including all functions from this file
 */

export default {
  saveNewPost,
  getPostById,
  getRecentPosts,
  deleteExistingPost,
  getPostsByOwnerId,
  getPostPreviewsByOwnerId,
  createPostLikeInteraction,
  interactions,
};
