import { dbInsertRecipeTags } from "scripts/tags.db.setup";

async function dbSetup() {
  await Promise.all([dbInsertRecipeTags()]);
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
