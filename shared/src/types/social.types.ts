import { User } from "./auth";

export type SocialMetrics = {
  followers: number;
  following: number;
  posts: number;
};

export type ProfilePreview = {
  user: User;
  socialMetrics: SocialMetrics;
};
