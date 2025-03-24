import postServices from "@/server/services/post.services";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { RequestHandler, Request, Response } from "express";
import { z } from "zod";

export const createPost: RequestHandler = async (req: Request, res: Response) => {
  const { recipe, images } = req.body as z.infer<typeof createNewPostSchema>;

  const { postId, recipeId } = await postServices.createNewPost(req.user!.id, { recipe, images });

  res.status(201).send({ postId, recipeId });
};

export const getPostById: RequestHandler = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const post = await postServices.getPostById(postId);

  res.send({
    post,
  });
};

export default {
  createPost,
  getPostById,
};
