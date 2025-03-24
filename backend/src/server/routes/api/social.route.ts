import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Router, Request, Response } from "express";
import { User } from "@flayva-monorepo/shared/types";

const router: Router = Router();

/**
 * Get a user's profile
 */
router.get("/u/:userID", async (req: Request, res: Response) => {
  const users = await db.select().from(usersTable).where(eq(usersTable.id, req.params.userID));
  const user = users[0];

  if (!user)
    res.status(404).send({
      exists: false,
      message: "Profile not found",
    });

  const structuredUser: User = {
    bio: user.bio,
    id: user.id,
    username: user.username,
    profile_picture_url: user.profile_picture_url ?? undefined,
  };

  res.status(200).send({
    exists: true,
    user: structuredUser,
  });
});

export default router;
