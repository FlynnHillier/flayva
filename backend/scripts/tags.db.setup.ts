import { db } from "@/db";
import { tags } from "@/db/schema";

//TODO: Add more tags (& make them meaningful) & move to seperate file
const tagsForInsert: Omit<typeof tags.$inferSelect, "id">[] = [
  {
    name: "vegan",
    category: "health",
    group: "spice",
  },
  {
    name: "vegetarian",
    category: "health",
    group: "spice",
  },
  {
    name: "carnivore",
    category: "health",
    group: "spice",
  },
  {
    name: "peanut-free",
    category: "health",
    group: "spice",
  },
];

/**
 * Insert recipe tags into the database
 */
export async function dbInsertRecipeTags() {
  await db
    .insert(tags)
    .values(tagsForInsert.map((tag, i) => ({ category: tag.category, name: tag.name, id: i + 1 })))
    .onConflictDoNothing();
}
