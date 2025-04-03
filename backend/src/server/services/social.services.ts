import { uploadThingFileUrl } from "@/lib/uploadthing";
import socialRepo from "@/server/repositories/social.repo";
import imagesServices from "@/server/services/images.services";
import { type User } from "@flayva-monorepo/shared/types/auth";
import { SocialMetrics, ProfilePreview } from "@flayva-monorepo/shared/types/social.types";
import {
  avatar,
  updateProfileFormSchema,
} from "@flayva-monorepo/shared/validation/social.validation";
import { z } from "zod";

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

/**
 *  SECTION: FOLLOWING
 *
 */

export const followUser = async (requesterId: string, targetId: string) => {
  if (requesterId === targetId) return { success: false, message: "Cannot follow yourself" };

  const [result] = await socialRepo.createFollower(requesterId, targetId);

  if (!result)
    return {
      success: false,
    };

  return {
    success: true,
  };
};

export const unfollowUser = async (requesterId: string, targetId: string) => {
  const result = await socialRepo.deleteFollower(requesterId, targetId);

  return {
    success: !!result,
  };
};

export const isFollowingUser = async (requesterId: string, targetId: string) => {
  const result = await socialRepo.isFollowing(requesterId, targetId);

  return {
    isFollowing: result,
  };
};

/**
 * !SECTION: PROFILE MANAGEMENT
 */
export const updateProfile = async (
  userId: string,
  data: z.infer<typeof updateProfileFormSchema>
) => {
  const { username, bio, avatar } = data;

  const result = await socialRepo.updateUser(userId, {
    bio,
    username,
  });

  if (avatar) await editProfileAvatar(userId, avatar);

  if (!result) return null;

  return {
    user: {
      bio: result.bio,
      id: result.id,
      username: result.username,
      profile_picture_url: result.profile_picture_url ?? undefined,
    },
  } as { user: User } satisfies {
    user: User;
  };
};

export const editProfileAvatar = async (userId: string, image: File) => {
  const { success: isValidFile, error: validationError } = avatar.safeParse(image);

  if (!isValidFile) {
    //TODO: logging
    throw new Error(`Invalid avatar image format, ${validationError.message}`);
  }

  // Upload the image to the cloud
  const { data: uploadData, error: uploadError } = await imagesServices.uploadAvatarImage(
    userId,
    image
  );

  if (uploadError) {
    // TODO: logging
    throw new Error(`Failed to upload image to cloud, ${uploadError.message}`);
  }

  const { key: uploadedFileKey } = uploadData;

  // Delete the old image from the cloud
  const oldImageKey = await socialRepo.getUserAvatarCloudFileKey(userId);

  if (oldImageKey === undefined) {
    // TODO: logging
    throw new Error("Failed to get old image key from the cloud");
  }

  if (oldImageKey !== null) {
    // There is an old image, delete it from the cloud
    const { success: isDeleted } = await imagesServices.deleteFile(oldImageKey);

    if (!isDeleted) {
      // TODO: logging
      throw new Error("Failed to delete old avatar image from the cloud");
    }
  }

  // Update the user profile with the new image URL
  const databaseUpdateResult = await socialRepo.updateUser(userId, {
    profile_picture_url: uploadThingFileUrl(uploadedFileKey), //TODO: perhaps this should be a file key instead of a URL in future?
  });

  if (!databaseUpdateResult) {
    // TODO: logging
    // Also, there exists a stale image in the cloud now!
    throw new Error("Failed to update user profile with the new image URL");
  }

  return {
    key: uploadedFileKey,
  };
};


/**
 * Get a list of users based on their username that are similar to the search query. Uses pagination
 * @param username - The username of a user in a search query
 * @param pageSize - The size of the results to be returned (for pagination)
 * @param pageNumber - The page number for the results to be returned (for pagination)
 *
 */
export const getUsersByUsername = async (
	username: string,
	pageSize: number,
	pageNumber: number
) => {
	const users = await socialRepo.getUsersByUsername(
		username,
		pageSize,
		pageNumber
	);

	if (!users) {
		return false;
	}

	return users;
};

export default {
  getProfilePreview,
  getUserById,
  getUserProfileSocialStats,
  followUser,
  unfollowUser,
  isFollowingUser,
  updateProfile,
  getUsersByUsername
};
