import { Router, Request, Response } from "express";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { sql, asc } from "drizzle-orm";
import { RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT } from "@/constants/posts.constants";
import { RecipeTag } from "@flayva-monorepo/shared/types";

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
    .orderBy(
      // 1. search for exact match
      // 2. search for match at the beginning of the string
      // 3. search for match anywhere in the string
      sql`CASE
      WHEN ${tags.name} ILIKE ${searchTerm.toLowerCase()} THEN 1 
      WHEN ${tags.name} ILIKE ${`${searchTerm.toLowerCase()}%`} THEN 2
      ELSE 3
    END`
    )
    .limit(RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT);

  const formattedTags: RecipeTag[] = results.map((tag) => ({ tagId: tag.id, tagName: tag.name }));

  res.status(200).json({ tags: formattedTags });
});

export default router;
