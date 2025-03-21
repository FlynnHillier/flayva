import { createNewPost } from "@/server/services/post.services";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { RequestHandler, Request, Response } from "express";
import { z } from "zod";

export const createPost: RequestHandler = async (req: Request, res: Response) => {
  const { recipe, images } = req.body as z.infer<typeof createNewPostSchema>;

  const { postId, recipeId } = await createNewPost(req.user!.id, { recipe, images });

  res.status(201).send({ postId, recipeId });
};

export default {
  createPost,
};
