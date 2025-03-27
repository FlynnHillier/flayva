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
