import { UnexpectedResponseFormatError } from "@/api/errors/api-errors";
import { request } from "@/lib/network";
import { ProfilePreview, User } from "@flayva-monorepo/shared/types";

/**
 * Fetches the user's profile information from the server.
 */
export async function fetchUserById(userID: string): Promise<{ user?: User }> {
  const { status, data } = await request({ url: `/api/s/u/${userID}`, method: "GET" });

  if (status === 404 || !data.user) {
    return { user: undefined };
  }

  return { user: data.user as User };
}

/**
 * Fetches the profile preview of a user by their ID.
 *
 * @param userId - The ID of the user to fetch the profile preview for.
 * @returns A promise that resolves to an object containing the profile preview.
 */
export async function fetchUserProfilePreview(
  userId: string
): Promise<{ profile: ProfilePreview }> {
  const { status, data } = await request({
    url: `/api/s/profile/preview/${userId}`,
    method: "GET",
  });

  if (status === 404 || !data.profile) {
    throw new UnexpectedResponseFormatError("fetchUserProfilePreview", data);
  }

  return { profile: data.profile as ProfilePreview };
}

/**
 * Follows a user by sending a request to the server.
 * @param userId - The ID of the user to follow.
 * @returns A promise that resolves to an object indicating success.
 */
export async function followUser(userId: string) {
  const { data } = await request({
    url: `/api/s/follow`,
    method: "POST",
    data: { targetUserId: userId },
  });

  return { success: true };
}

/**
 * Unfollows a user by sending a request to the server.
 * @param userId - The ID of the user to unfollow.
 * @returns A promise that resolves to an object indicating success.
 */
export async function unfollowUser(userId: string) {
  const { data } = await request({
    url: `/api/s/unfollow`,
    method: "POST",
    data: { targetUserId: userId },
  });

  return { success: true };
}

/**
 * Fetches the follow status of the current user for a given user ID.
 * @param userId - The ID of the user to check the follow status for.
 */
export async function getOwnFollowingUserStatus(userId: string) {
  const { data } = await request({
    url: `/api/s/isfollowing/${userId}`,
    method: "GET",
  });

  if (data.isFollowing === undefined) {
    throw new UnexpectedResponseFormatError("getFollowStatus", data);
  }

  return { isFollowing: data.isFollowing } as { isFollowing: boolean };
}
