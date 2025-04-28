import { SOCIAL_AVATAR_IMAGE_MAX_FILE_SIZE } from "@flayva/constants";
import { customImageFile } from "./common.validation";
import { z } from "zod";
import { zfd } from "zod-form-data";

// ## PROFILE DISPLAY

export const username = z.string().min(1).max(30);
export const bio = z.string().max(150).optional();

export const avatar = customImageFile({
  size: SOCIAL_AVATAR_IMAGE_MAX_FILE_SIZE,
  type: ["image/*"],
});

// ## FORMS

export const updateProfileFormSchema = zfd.formData({
  username: username.optional(),
  bio: bio.optional(),
  avatar: avatar.optional(),
});
