import { Router, Request, Response } from "express";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { sql } from "drizzle-orm";
import { RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT } from "@/constants/posts.constants";

const router: Router = Router();

/**
 * search for recipe tags
 */
router.get("/r/tags/q/:search", async (req, res) => {
  const searchTerm = req.params.search;

  const results = await db
    .select()
    .from(tags)
    .where(sql`${tags.name} ILIKE ${`%${searchTerm.toLowerCase()}%`}`)
    .limit(RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT);

  res.status(200).json({ tags: results });
});

export default router;
