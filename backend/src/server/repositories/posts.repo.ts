import { db } from "@/db";
import {
  post_images,
  posts,
  recipe_ingredients,
  recipe_instruction_steps,
  recipe_meta_infos,
  recipe_tags,
  recipes,
} from "@/db/schema";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { z } from "zod";
import { UploadedFileData } from "uploadthing/types";

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
  }: { imageUploads: UploadedFileData[]; recipe: z.infer<typeof createNewPostSchema>["recipe"] }
) =>
  db.transaction(async (tx) => {
    const [post] = await tx
      .insert(posts)
      .values({
        ownerID: ownerId,
      })
      .returning();

    const [recipe] = await tx
      .insert(recipes)
      .values({
        master_post_id: post.id,
        title: recipeData.title,
        description: recipeData.description,
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
              amount_fractional_numerator: ingredient.amount.fractional?.numerator,
              amount_fractional_denominator: ingredient.amount.fractional?.denominator,
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
            .values(imageUploads.map((image) => ({ key: image.key, postID: post.id })));

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

export default {
  saveNewPost,
};
