import socialServices from "@/server/services/social.services";
import { updateProfileFormSchema } from "@flayva-monorepo/shared/validation/social.validation";
import { RequestHandler } from "express";
import { z } from "zod";

export const getUserById: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).send({ message: "User Id is required" });
    return;
  }

  const user = await socialServices.getUserById(userId);

  if (user) res.status(200).send({ user });
  else res.status(404).send({ message: "user not found" });
};

export const getProfilePreview: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).send({ message: "User Id is required" });
    return;
  }

  const profile = await socialServices.getProfilePreview(userId);

  if (profile) res.status(200).send({ profile: profile });
  else res.status(404).send({ message: "user not found" });
};

/**
 * !SECTION: FOLLOWING
 */

export const followUser: RequestHandler = async (req, res) => {
  const { targetUserId } = req.body as { targetUserId: string };

  if (targetUserId === req.user!.id) {
    res.status(400).send({ message: "You cannot follow yourself" });
    return;
  }

  const { success } = await socialServices.followUser(req.user!.id, targetUserId);

  if (success) res.status(204).send();
  else res.status(404).send({ message: "user not found" });
};

export const unfollowUser: RequestHandler = async (req, res) => {
  const { targetUserId } = req.body as { targetUserId: string };

  const { success } = await socialServices.unfollowUser(req.user!.id, targetUserId);

  if (success) res.status(204).send();
  else res.status(409).send({ message: "you do not follow this user" });
};

export const getFollowStatus: RequestHandler = async (req, res) => {
  const { targetUserId } = req.params as { targetUserId: string };

  if (!targetUserId) {
    res.status(400).send({ message: "User Id is required" });
    return;
  }

  const { isFollowing } = await socialServices.isFollowingUser(req.user!.id, targetUserId);

  res.status(200).send({ isFollowing });
};

/**
 * !SECTION: PROFILE MANAGEMENT
 */

export const updateOwnUserProfile: RequestHandler = async (req, res) => {
  const userId = req.user!.id;

  const data = req.body as z.infer<typeof updateProfileFormSchema>;

  const result = await socialServices.updateProfile(userId, data);

  if (result?.user) res.status(200).send({ user: result.user });
  else res.status(500).send({ message: "Failed to update profile" });
};

export const getUsersByUsername = async (req: Request, res: Response) => {
	const { username, pageSize, pageNumber } = req.query;
	console.log(username, pageSize, pageNumber)
	if (!username || !pageSize || !pageNumber) {
		res.status(400).send({
			message:
				'Missing required query parameters: username, pageSize, and pageNumber',
		});
		return;
	}

	const users = await socialServices.getUsersByUsername(
		username.toString(),
		parseInt(pageSize.toString()),
		parseInt(pageNumber.toString())
	);

	console.log(users.pagination)
	res.status(200).send({ users });
};

export default {
  getUserById,
  getProfilePreview,
  followUser,
  unfollowUser,
  getFollowStatus,
  updateOwnUserProfile,
  getUsersByUsername
};
