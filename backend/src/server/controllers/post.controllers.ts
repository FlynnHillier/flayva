import postServices from "@/server/services/post.services";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { RequestHandler, Request, Response } from "express";
import { z } from "zod";

export const createPost: RequestHandler = async (req: Request, res: Response) => {
  const { recipe, images } = req.body as z.infer<typeof createNewPostSchema>;

  const { postId, recipeId } = await postServices.createNewPost(req.user!.id, { recipe, images });

  res.status(201).send({ postId, recipeId });
};

export const deletePost: RequestHandler = async (req: Request, res: Response) => {
  const postId = req.body.postId;

  const { deleted } = await postServices.deletePost(postId);

  if (!deleted) {
    res.status(404).send({
      deleted: false,
      message: `Post '${postId}' not found`,
    });
    return;
  }

  res.status(200).send({
    deleted: true,
    message: `Post '${postId}' deleted`,
  });
};

export const getPostById: RequestHandler = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const post = await postServices.getPostById(postId);

  res.send({
    post,
  });
};

export const getFeed: RequestHandler = async (req: Request, res: Response) => {
  const feed = await postServices.getFeed();

  res.status(200).send(feed);
};

export const infiniteScrollProfilePostPreviews: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { ownerId } = req.params;
  const cursor = req.query.cursor ? Number(req.query.cursor) : 0;

  const result = await postServices.infiniteScrollProfilePostPreviews(ownerId, cursor);

  res.status(200).send({
    previews: result.previews,
    nextCursor: result.nextCursor,
  });
};

export default {
  deletePost,
  createPost,
  getPostById,
  getFeed,
  infiniteScrollProfilePostPreviews,
};
