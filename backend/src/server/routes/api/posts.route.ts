import { Router, Request, Response, NextFunction } from "express";
import { POST as POST_VALIDATION } from "@flayva-monorepo/shared/validation";
import { POST as POST_CONSTANT } from "@flayva-monorepo/shared/constants";
import { validateMultiPartFormData } from "@/server/middleware/validation.middleware";
import { POST_IMAGE_MAX_COUNT } from "@flayva-monorepo/shared/constants/post.constants";
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
import { z } from "zod";
import { ensureAuthenticated } from "@/server/middleware/auth.middleware";
import { uploadthing } from "@/lib/uploadthing";
import { UploadedFileData } from "uploadthing/types";
import { nanoid } from "nanoid";
const router: Router = Router();

router.post(
  "/create",
  ensureAuthenticated,
  validateMultiPartFormData(POST_VALIDATION.createNewPostSchema, {
    files: [{ key: "images", maxCount: POST_IMAGE_MAX_COUNT }],
    json: ["recipe"],
  }),
  async (req: Request, res: Response) => {
    const { recipe, images } = req.body as z.infer<typeof POST_VALIDATION.createNewPostSchema>;

    // Save post and recipe to database
    await db
      .transaction(async (tx) => {
        const inserted_post = (
          await tx
            .insert(posts)
            .values({
              // @ts-ignore
              // TODO: REMOVE this ts-ignore
              ownerID: req.user!.id,
            })
            .returning()
        )[0];

        const inserted_recipe = (
          await tx
            .insert(recipes)
            .values({
              master_post_id: inserted_post.id,
              title: recipe.title,
              description: recipe.description,
            })
            .returning()
        )[0];

        /**
         * Save images to the cloud, and save a reference in the database
         */
        const saveImagesToCloud = async () => {
          const uploadResults = await uploadthing.uploadFiles(
            images.map(
              (image) =>
                new File(
                  [image],
                  `${nanoid(POST_CONSTANT.POST_IMAGE_CLOUD_ID_LENGTH)}.${image.name
                    .split(".")
                    .at(-1)}`,
                  {
                    type: image.type,
                  }
                )
            )
          );

          const successfulUploads = uploadResults
            .filter(({ error, data }) => !error && data)
            .map(({ data }) => data as UploadedFileData);

          if (successfulUploads.length !== images.length) {
            // Try to remove the successfully uploaded images if there is an error
            const { success, deletedCount } = await uploadthing.deleteFiles(
              successfulUploads.map((images) => images.key)
            );

            if (!success || deletedCount !== successfulUploads.length) {
              //TODO: log here (we have images that are uploaded but not saved in the db)
            }

            throw new Error("Failed to upload images");
          }

          await tx
            .insert(post_images)
            .values(
              successfulUploads.map((image) => ({ key: image.key, postID: inserted_post.id }))
            );
        };

        await Promise.all([
          // Upload images
          saveImagesToCloud(),
          // Insert recipe ingredients
          tx.insert(recipe_ingredients).values(
            recipe.ingredients.map((ingredient) => ({
              recipe_id: inserted_recipe.id,
              ingredient_id: ingredient.id,
              amount_whole: ingredient.amount.whole,
              amount_fractional_numerator: ingredient.amount.fractional?.numerator,
              amount_fractional_denominator: ingredient.amount.fractional?.denominator,
              unit: ingredient.unit,
            }))
          ),
          // Insert recipe tags
          tx.insert(recipe_tags).values(
            recipe.tags.map((tag) => ({
              recipeID: inserted_recipe.id,
              tagID: tag.tagId,
            }))
          ),
          // Insert recipe instructions
          tx.insert(recipe_instruction_steps).values(
            recipe.instructions.map((instruction, i) => ({
              recipeId: inserted_recipe.id,
              stepNumber: i,
              instruction: instruction.instruction,
            }))
          ),
          // Insert recipe meta info
          tx.insert(recipe_meta_infos).values({
            recipeId: inserted_recipe.id,
            // TODO: perhaps change how we store these values in the future
            estimatedCookTime: recipe.metaInfo?.cookTime?.toString(),
            estimatedPrepTime: recipe.metaInfo?.prepTime?.toString(),
            servings: recipe.metaInfo?.servings,
          }),
        ]);
      })
      .catch((err) => {
        //TODO: log error properly
        console.error(err);
        res.status(500).send({ message: "failed to create post" });
      });

    res.status(201).send({ message: "post created" });
  }
);

export default router;
