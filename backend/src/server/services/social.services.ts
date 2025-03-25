import socialRepo from "@/server/repositories/social.repo";
import { User } from "@flayva-monorepo/shared/types";

/**
 * Get a user by their ID
 * @param userId - the ID of the user
 * @returns the user object or null if the user does not exist
 */
export const getUserById = async (userId: string) => {
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

export default {
  getUserById,
};
