import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  POST_DESCRIPTION_MAX_LENGTH,
  POST_TITLE_MAX_LENGTH,
  POST_DESCRIPTION_MIN_LENGTH,
  POST_TITLE_MIN_LENGTH,
  POST_IMAGE_ALLOWED_FILE_TYPES,
  POST_IMAGE_MAX_COUNT,
  POST_IMAGE_MAX_FILE_SIZE,
  POST_IMAGE_MIN_COUNT,
} from "../constants/post.constants";
import { RECIPE } from "../validation/index";

// ## POST DISPLAY
export const title = z.string().min(POST_TITLE_MIN_LENGTH).max(POST_TITLE_MAX_LENGTH);
export const description = z
  .string()
  .min(POST_DESCRIPTION_MIN_LENGTH)
  .max(POST_DESCRIPTION_MAX_LENGTH);

// ## IMAGES

export const image = zfd
  .file()
  .refine((file) => POST_IMAGE_ALLOWED_FILE_TYPES.includes(file.type), {
    message: `File type must be one of: ${POST_IMAGE_ALLOWED_FILE_TYPES.join(", ")}`,
  })
  .refine((file) => file.size <= POST_IMAGE_MAX_FILE_SIZE, {
    message: `File size too large, maximum ${POST_IMAGE_MAX_FILE_SIZE / (1024 * 1024)}MB`,
  });

export const images = z.array(image).min(POST_IMAGE_MIN_COUNT).max(POST_IMAGE_MAX_COUNT);

// ## FORMS
export const createNewPostSchema = zfd.formData({
  recipe: RECIPE.recipe,
  images: images,
});
