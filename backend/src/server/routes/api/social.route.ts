import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Router, Request, Response } from "express";

const router: Router = Router();

/**
 * Get a user's profile
 */
router.get("/u/:userID", async (req: Request, res: Response) => {
  const profiles = await db.select().from(users).where(eq(users.id, req.params.userID));
  const profile = profiles[0];

  if (!profile)
    res.status(404).send({
      exists: false,
      message: "Profile not found",
    });
  else
    res.status(200).send({
      exists: true,
      profile: {
        id: profile.id,
        username: profile.username,
        bio: profile.bio,
        profile_picture_url: profile.profile_picture_url ?? undefined,
      },
    });
});

export default router;
