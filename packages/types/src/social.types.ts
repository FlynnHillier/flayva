import z from "zod";
import { User } from "./auth.types";
import { SOCIAL } from "@flayva/validation";

export type SocialMetrics = {
  followers: number;
  following: number;
  posts: number;
};

export type ProfilePreview = {
  user: User;
  socialMetrics: SocialMetrics;
};

export type UpdateProfileFormSchemaType = z.infer<
  typeof SOCIAL.updateProfileFormSchema
>;
