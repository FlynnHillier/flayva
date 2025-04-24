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
  tags as tagsTable,
} from "@/db/schema";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { z } from "zod";
import { UploadedFileData } from "uploadthing/types";
import { DbFindManyParams } from "@/types/db.types";
import { and, asc, eq, inArray, or, sql, gt, lte } from "drizzle-orm";
import { RecipeTag } from "@flayva-monorepo/shared/types";
import { NestedRepositoryObject } from "@/types/api.types";
import { EMBEDDING_DIM } from "@flayva-monorepo/shared/constants/embedding.constants";

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
              tagID: tag.id,
            }))
          );
        
    const insertEmbeddingPromise =
      recipeData.tags.length === 0
        ? Promise.resolve()
        : (async () => {
            const tagEmbeddings = await tx
              .select({ embedding: tagsTable.embedding })
              .from(tagsTable)
              .where(
                inArray(
                  tagsTable.id,
                  recipeData.tags.map((tag) => tag.id)
                )
              );

            if (tagEmbeddings.length === 0) return;

            const dimension = EMBEDDING_DIM;
            const averagedEmbedding = new Array(dimension).fill(0);

            for (const tag of tagEmbeddings) {
              tag.embedding?.forEach((value, i) => {
                averagedEmbedding[i] += value;
              });
            }

            for (let i = 0; i < dimension; i++) {
              averagedEmbedding[i] /= tagEmbeddings.length;
            }

            await tx
              .update(posts)
              .set({ embedding: averagedEmbedding })
              .where(eq(posts.id, post.id));
          })();

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
      insertEmbeddingPromise,
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
 *
 *
 * Tags
 *
 *
 */

/**
 * Get a list of all tags from the database
 */
export const getTagList = (): Promise<RecipeTag[]> =>
  db.select().from(tagsTable);

/**
 *
 *
 * POST PREVIEWS
 *
 *
 */

/**
 * Get post previews from the database
 *
 * @param options query options to dictate which posts to fetch
 * @returns post previews
 */
export const getPostPreviews = async (
  options: Omit<DbFindManyParams<"posts">, "with" | "columns">
) => {
  const unformattedPostPreviews = await db.query.posts.findMany({
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
        limit: 1,
      },
      recipe: {
        columns: {
          id: true,
          title: true,
          description: true,
        },
        with: {
          tagLinks: {
            with: {
              tag: {
                columns: {
                  category: true,
                  emoji: true,
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      owner: {
        columns: {
          id: true,
          username: true,
          profile_picture_url: true,
          bio: true,
        },
      },
    },
    ...options,
  });

  return unformattedPostPreviews.map((postPreview) => ({
    ...postPreview,
    image: postPreview.images[0],
    images: undefined,
    recipe: {
      ...postPreview.recipe,
      // Remove the tagLinks property and replace it with a tags property
      tags: postPreview.recipe.tagLinks.map((tagLink) => tagLink.tag),
      tagLinks: undefined,
    },
  }));
};

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
 * Get post previews by post IDs
 * @param postIds - The IDs of the post previews to fetch
 * @param options - query options to dictate which posts to fetch
 */
export const getPostPreviewsByPostIds = (
  postIds: string[],
  options: Omit<Parameters<typeof getPostPreviews>[0], "where">
) =>
  getPostPreviews({
    where: (posts, { inArray }) => inArray(posts.id, postIds),
    ...options,
  });

/**
 *
 *
 *
 *
 * GETTING POSTS
 *
 *
 *
 *
 *
 */

/**
 * Get posts from the database
 *
 * @param options query options to dictate which posts to fetch
 */
export const getPosts = async (
  options: Omit<DbFindManyParams<"posts">, "with" | "columns">
) => {
  const posts = await db.query.posts.findMany({
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
          tagLinks: {
            with: {
              tag: {
                columns: {
                  category: true,
                  emoji: true,
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
  });

  const postsWithExtras = await Promise.all(
    posts.map(async (post) => {
      /**
       * Get statistics for the recipe ratings
       */
      const ratingStatisticsPromise = db
        .select({
          average: sql<number>`avg(${recipe_ratings.rating})`.mapWith(Number),
          count: sql<number>`count(${recipe_ratings.rating})`.mapWith(Number),
          distribution: {
            1: sql<number>`count(${recipe_ratings.rating}) filter (where ${recipe_ratings.rating} = 1)`.mapWith(
              Number
            ),
            2: sql<number>`count(${recipe_ratings.rating}) filter (where ${recipe_ratings.rating} = 2)`.mapWith(
              Number
            ),
            3: sql<number>`count(${recipe_ratings.rating}) filter (where ${recipe_ratings.rating} = 3)`.mapWith(
              Number
            ),
            4: sql<number>`count(${recipe_ratings.rating}) filter (where ${recipe_ratings.rating} = 4)`.mapWith(
              Number
            ),
            5: sql<number>`count(${recipe_ratings.rating}) filter (where ${recipe_ratings.rating} = 5)`.mapWith(
              Number
            ),
          },
        })
        .from(recipe_ratings)
        .where(
          and(
            eq(recipe_ratings.recipe_id, post.recipeId),
            gt(recipe_ratings.rating, 0),
            lte(recipe_ratings.rating, 5)
          )
        );

      /**
       * Get statistics for the recipe likes
       */
      const likeStatisticPromise = db
        .select({
          count: sql<number>`count(${post_likes.postID})`.mapWith(Number),
        })
        .from(post_likes)
        .where(eq(post_likes.postID, post.id));

      /**
       * Await for both promises to resolve
       */
      const [[ratingsStatistics], [likeStatistics]] = await Promise.all([
        ratingStatisticsPromise,
        likeStatisticPromise,
      ]);

      //TODO: refactor rest of codebase to use updated post format

      return {
        ...post,
        likes: {
          count: likeStatistics.count,
        },
        recipe: {
          ...post.recipe,
          ratings: {
            statiststics: ratingsStatistics,
          },
          tagLinks: undefined,
          tags: post.recipe.tagLinks.map((tag) => tag.tag),
        },
      };
    })
  );

  return postsWithExtras;
};

/**
 * Get posts by IDs
 * @param postIds - The IDs of the posts to fetch
 * @param options - query options to dictate which posts to fetch
 */
export const getPostsById = (
  postIds: string[],
  options: Omit<Parameters<typeof getPosts>[0], "where"> = {}
) =>
  getPosts({
    where: (posts, { eq, or }) => or(...postIds.map((id) => eq(posts.id, id))),
    ...options,
  });

/**
 * Get a post by its ID
 * @param postId - The ID of the post to fetch
 * @param options - query options to dictate which posts to fetch
 */
export const getPostById = async (
  postId: string,
  options: Omit<Parameters<typeof getPostsById>[1], "limit"> = {}
) => {
  const posts = await getPostsById([postId], { limit: 1, ...options });

  if (posts.length === 0) return null;

  return posts[0];
};

/**
 * Get a post by its recipe ID
 * @param postId - The ID of the post to fetch
 * @param options - query options to dictate which posts to fetch
 */
export const getPostByRecipeId = (
  recipeId: string,
  options: Omit<Parameters<typeof getPosts>[0], "where"> = {}
) =>
  getPosts({
    ...options,
    where: (posts, { eq }) => eq(posts.recipeId, recipeId),
  });

/**
 * Get the most recent posts
 * @param limit - The number of posts to fetch
 *
 */
export const getRecentPosts = async (
  options: Omit<Parameters<typeof getPosts>[0], "orderBy"> = {}
) => {
  const posts = await getPosts({
    orderBy: (posts, { desc }) => desc(posts.created_at),
    ...options,
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
 * SEARCH
 *
 *
 */
export const getPostIdsByTagsAndSimilarTitle = (
  recipeTitle: string,
  tagIds: number[]
) =>
  db
    .select({
      postId: posts.id,
    })
    .from(posts)
    .leftJoin(recipes, eq(posts.recipeId, recipes.id))
    .leftJoin(recipe_tags, eq(posts.recipeId, recipe_tags.recipeID))
    .where(
      and(
        sql`${recipes.title} ILIKE ${"%" + recipeTitle + "%"}`,
        // TODO: change to match where all tags are selected, not just one
        tagIds.length > 0
          ? or(...tagIds.map((id) => eq(recipe_tags.tagID, id)))
          : sql`TRUE`
      )
    )
    .orderBy(
      sql`CASE
          WHEN ${recipes.title} ILIKE ${recipeTitle.toLowerCase()} THEN 1 
          WHEN ${recipes.title} ILIKE ${`${recipeTitle.toLowerCase()}%`} THEN 2
          ELSE 3
        END`,
      asc(recipes.id)
    )
    .groupBy(posts.id, recipes.title, recipes.id);

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
  getPostsById,
  getRecentPosts,
  deleteExistingPost,
  getPostsByOwnerId,
  getPostPreviewsByOwnerId,
  getPostPreviewsByPostIds,
  getPostByRecipeId,
  getTagList,
  getPostIdsByTagsAndSimilarTitle,
  createPostLikeInteraction,
  interactions,
};
