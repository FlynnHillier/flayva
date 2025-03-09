import fs from "node:fs/promises";
import path from "node:path";
import { ingredient_items } from "@/db/schema";
import { DATA_FOLDER_PATH, fileExists } from "scripts/utils";

type ParseTo = Omit<typeof ingredient_items.$inferSelect, "">;

/**
 * All food groups in the FooDB dataset
 */
const ALL_FOOD_GROUPS = [
  "Herbs and Spices",
  "Vegetables",
  "Fruits",
  "Nuts",
  "Cereals and cereal products",
  "Pulses",
  "Teas",
  "Gourds",
  "Coffee and coffee products",
  "Soy",
  "Cocoa and cocoa products",
  "Beverages",
  "Aquatic foods",
  "Animal foods",
  "Milk and milk products",
  "Eggs",
  "Confectioneries",
  "Baking goods",
  "Dishes",
  "Snack foods",
  "Baby foods",
  "Unclassified",
  "Fats and oils",
  "Herbs and spices",
] as const;

/**
 * Food groups that ARE NOT useful for our purposes
 */
const EXCLUDE_FOOD_GROUPS = [
  "Dishes",
  "Unclassified",
] as const satisfies (typeof ALL_FOOD_GROUPS)[number][];

/**
 * Parse the FooDB dataset to a format that can be inserted into the database
 */
async function parseFooDB(filepath: string) {
  if (!(await fileExists(filepath))) {
    console.error(`File not found: ${filepath}`);
    process.exit(1);
  }

  const file = await fs.readFile(filepath, "utf-8");
  const data = file.split("\n").map((line) => JSON.parse(line));

  // Identify all Food groups - for logging purposes
  const seen_food_groups = new Set<string>();
  for (const item of data) {
    const group = item.food_group;

    if (!seen_food_groups.has(group)) {
      if (!ALL_FOOD_GROUPS.includes(group)) {
        console.log(`Unknown food group: ${group} - itemID: ${item.id}`);
      }
      seen_food_groups.add(group);
    }
  }

  const INCLUDE_FOOD_GROUPS = ALL_FOOD_GROUPS.filter(
    (group) => !EXCLUDE_FOOD_GROUPS.includes(group as any)
  );

  const parsed = data
    .filter((item) => INCLUDE_FOOD_GROUPS.includes(item.food_group))
    .map<ParseTo>((item) => ({
      name: item.name,
      group: item.food_group,
      subgroup: item.food_subgroup,
      id: item.id,
    }));

  const meta_groups = Array.from(new Set(parsed.map((item) => item.group)));
  const meta_subgroups = meta_groups.reduce((acc, group) => {
    acc[group] = Array.from(
      new Set(parsed.filter((item) => item.group === group).map((item) => item.subgroup))
    );
    return acc;
  }, {} as Record<string, string[]>);

  const meta = {
    total: parsed.length,
    groups: meta_groups,
    subgroups: {
      grouped: meta_subgroups,
      all: Array.from(new Set(parsed.map((item) => item.subgroup))),
    },
  };

  return { parsed, meta };
}

async function parseFooDBToFile(dbFilepath: string, output_folder: string) {
  const { parsed, meta } = await parseFooDB(dbFilepath);

  const saveParsedTo = path.join(output_folder, "parsed-foodb.json");
  const saveMetaTo = path.join(output_folder, "meta-parsed-foodb.json");

  await fs.writeFile(saveParsedTo, JSON.stringify(parsed, null, 2)).catch((err) => {
    console.error(err);
    process.exit(1);
  });

  console.log(`Saved ${parsed.length} parsed items to ${saveParsedTo}`);

  await fs.writeFile(saveMetaTo, JSON.stringify(meta, null, 2)).catch((err) => {
    console.error(err);
    process.exit(1);
  });

  console.log(`Saved meta data to ${saveMetaTo}`);
}

async function main() {
  const DB_FILEPATH = path.join(DATA_FOLDER_PATH, "foodb.json");

  await parseFooDBToFile(DB_FILEPATH, DATA_FOLDER_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
