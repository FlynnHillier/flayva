import { db } from "@/db";
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
 * Db valid recipe ingredient json
 */
const dbValidRecipeIngredient = z.object({
  name: z.string(),
  group: z.enum(INGREDIENT_GROUPS),
  subgroup: z.enum(INGREDIENT_SUBGROUPS),
  id: z.number(),
});

/**
 * Insert recipe ingredients into the database
 */
export async function dbInsertRecipeIngredients() {
  const data_fp = path.join(DATA_FOLDER_PATH, "parsed-foodb.json");

  if (!(await fileExists(data_fp))) {
    console.error(
      `Cannot insert Ingredients: File not found: ${data_fp}, run script 'parse:ingredients' first`
    );
    return;
  }

  const fileData = await fs.readFile(data_fp, "utf-8").catch((err) => {
    console.error(`Failed to insert Ingredients: failed to read file ${data_fp}`);
    return;
  });

  const parsed_data = JSON.parse(fileData as string);

  // Validate json data is in a valid format for insertion
  const {
    error,
    success,
    data: validatedIngredientData,
  } = z.array(dbValidRecipeIngredient).safeParse(parsed_data);

  if (error || !success || !validatedIngredientData) {
    console.error(`Failed to insert Ingredients: Invalid data format, `, error);
    return;
  }

  await db.insert(ingredient_items).values(validatedIngredientData).onConflictDoNothing();
}
