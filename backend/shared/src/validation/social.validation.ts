import { customImageFile } from "./common.validation";
import { z } from "zod";
import { zfd } from "zod-form-data";

// ## PROFILE DISPLAY

export const username = z.string().min(1).max(30);
export const bio = z.string().max(150).optional();

export const avatar = customImageFile({
  size: 1024 * 1024 * 5, // 5MB
  type: ["image/jpeg", "image/png"],
});

// ## FORMS

export const updateProfileFormSchema = zfd.formData({
  username: username.optional(),
  bio: bio.optional(),
  avatar: avatar.optional(),
});
