import socialRepo from "@/server/repositories/social.repo";
import { User, SocialMetrics, ProfilePreview } from "@flayva-monorepo/shared/types";

/**
 * Get a user by their ID
 * @param userId - the ID of the user
 * @returns the user object or null if the user does not exist
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  const user = await socialRepo.getUserById(userId);

  if (!user) return null;

  const formattedUser: User = {
    id: user.id,
    bio: user.bio,
    username: user.username,
    profile_picture_url: user.profile_picture_url ?? undefined,
  };

  return formattedUser;
};

export const getProfilePreview = async (userId: string): Promise<ProfilePreview | null> => {
  const user = await getUserById(userId);

  if (!user) return null;

  const socialMetrics = await getUserProfileSocialStats(userId);

  if (!socialMetrics) return null;

  return {
    user: user,
    socialMetrics: socialMetrics,
  };
};

export const getUserProfileSocialStats = async (userId: string): Promise<SocialMetrics | null> => {
  const result = await socialRepo.getUserProfileSocialStats(userId);

  if (!result) return null;

  return {
    followers: result.followersCount,
    following: result.followingCount,
    posts: result.postsCount,
  };
};

export default {
  getProfilePreview,
  getUserById,
  getUserProfileSocialStats,
};
