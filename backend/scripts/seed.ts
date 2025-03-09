import { dbInsertRecipeIngredients } from "scripts/ingredients.db.setup";
import { dbInsertRecipeTags } from "scripts/tags.db.setup";

async function dbSetup() {
  await Promise.all([dbInsertRecipeTags(), dbInsertRecipeIngredients()]);
}

dbSetup()
  .then(() => {
    console.log("Database setup complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Database setup failed:", err);
    process.exit(1);
  });
