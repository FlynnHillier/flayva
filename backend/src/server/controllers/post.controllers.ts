import postServices from "@/server/services/post.services";
import { NestedControllerObject } from "@/types/api.types";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import { RequestHandler, Request, Response } from "express";
import { z } from "zod";

export const createPost: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { recipe, images } = req.body as z.infer<typeof createNewPostSchema>;

  const { postId, recipeId } = await postServices.createNewPost(req.user!.id, {
    recipe,
    images,
  });

  res.status(201).send({ postId, recipeId });
};

export const deletePost: RequestHandler = async (
  req: Request,
  res: Response
) => {
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

export const getPostById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const postId = req.params.id;

  const post = await postServices.getPostById(postId);

  if (!post) {
    res.status(404).send({
      message: `Post '${postId}' not found`,
    });
    return;
  }

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

  const result = await postServices.infiniteScrollProfilePostPreviews(
    ownerId,
    cursor
  );

  res.status(200).send({
    previews: result.previews,
    nextCursor: result.nextCursor,
  });
};

export const interactions = {
  /**
   * Like and unlike posts
   */
  like: {
    status: async (req: Request, res: Response) => {
      const { postId } = req.params;

      if (!postId) {
        res.status(400).send({
          message: "Post ID is required.",
        });
        return;
      }

      const { liked } = await postServices.interactions.like.status(
        postId,
        req.user!.id
      );

      res.status(200).send({
        liked,
        message: `Post '${postId}' ${liked ? "liked" : "not liked"}`,
      });
    },
    add: async (req: Request, res: Response) => {
      const { postId } = req.body as { postId: string };

      const { likeAdded } = await postServices.interactions.like.add(
        postId,
        req.user!.id
      );

      if (!likeAdded) {
        res.status(409).send({
          message: `Post '${postId}' already liked, or not found.`,
        });
        return;
      }

      res.status(200).send({
        liked: true,
        message: `Post '${postId}' liked`,
      });
    },
    remove: async (req: Request, res: Response) => {
      const { postId } = req.body as { postId: string };

      const { likeRemoved } = await postServices.interactions.like.remove(
        postId,
        req.user!.id
      );

      if (!likeRemoved) {
        res.status(409).send({
          message: `Post '${postId}' not yet liked, or not found.`,
        });
        return;
      }

      res.status(200).send({
        unliked: true,
        message: `Post '${postId}' unliked`,
      });
    },
    toggle: async (req: Request, res: Response) => {
      const { postId } = req.body as { postId: string };

      const { added, removed } = await postServices.interactions.like.toggle(
        postId,
        req.user!.id
      );

      if (!added && !removed) {
        res.status(404).send({
          message: `Post '${postId}' not found.`,
        });
        return;
      }

      res.status(200).send({
        toggled: true,
        isLiked: added,
        message: `Post '${postId}' toggled`,
      });
    },
  },
} as const satisfies NestedControllerObject;

export default {
  deletePost,
  createPost,
  getPostById,
  getFeed,
  infiniteScrollProfilePostPreviews,
  interactions,
};
