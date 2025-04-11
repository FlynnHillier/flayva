import postRepo from "@/server/repositories/post.repo";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to check if the user making the request is the owner of the post
 *
 * Expects the request to have a user object
 *
 * @param postId - The ID of the post to check
 * @returns A middleware function
 */
export const isRequestPostOwner =
  (postId: string | ((req: Request) => string)) =>
  async (req: Request, res: Response, next: NextFunction) => {
    postId = typeof postId === "function" ? postId(req) : postId;

    const post = await postRepo.getPostById(postId);

    if (!post) {
      res.status(404).send({
        message: `Post '${postId}' not found`,
      });
      return;
    }

    if (post.owner.id === req.user?.id) next();
    else res.status(403).send("You are not the owner of this post.");
  };
