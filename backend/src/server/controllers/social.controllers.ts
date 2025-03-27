import socialServices from "@/server/services/social.services";
import { RequestHandler } from "express";

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

export default {
  getUserById,
  getProfilePreview,
};
