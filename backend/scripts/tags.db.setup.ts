import { db } from "@/db";
import { tags } from "@/db/schema";
import { EMBEDDING, RECIPE } from "@flayva-monorepo/shared/constants";
import { ingredient_items } from "@/db/schema";
import path from "node:path";
import { DATA_FOLDER_PATH, fileExists } from "scripts/utils";
import fs from "node:fs/promises";
import { z } from "zod";
import {
  INGREDIENT_GROUPS,
  INGREDIENT_SUBGROUPS,
} from "@flayva-monorepo/shared/constants/recipes.constants";

/**
 * Insert recipe tags into the database
 */
const dbValidTags = z.object({
  name: z.string(),
  category: z.string(),
  emoji: z.string(),
  embedding: z.array(z.number()).length(EMBEDDING.EMBEDDING_DIM)
})

export async function dbInsertRecipeTags() {
  const data_fp = path.join(DATA_FOLDER_PATH, "embedded_tags_32.json");

  if (!(await fileExists(data_fp))) {
    console.error(
      `Cannot insert Ingredients: File not found: ${data_fp}, as @Arshiea'`
    );
    return;
  }

  const fileData = await fs.readFile(data_fp, "utf-8").catch((err) => {
    console.error(
      `Failed to insert Ingredients: failed to read file ${data_fp}`
    );
    return;
  });

  const parsed_data = JSON.parse(fileData as string);

  // Validate json data is in a valid format for insertion
  const {
    error,
    success,
    data: validatedTagsData,
  } = z.array(dbValidTags).safeParse(parsed_data);

  if (error || !success || !validatedTagsData) {
    console.error(`Failed to insert Ingredients: Invalid data format, `, error);
    return;
  }
  //gets here just fine
  await db
    .insert(tags)
    .values(validatedTagsData.map((tag, i) => ({name: tag.name, category: tag.category, emoji: tag.emoji, embedding: tag.embedding, id: i})))
    .onConflictDoNothing();
}

