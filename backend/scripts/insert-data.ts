import { dbInsertMockSocialData } from "./dummy.posts";

async function dbInsertSocial(){
    await dbInsertMockSocialData()
}

dbInsertSocial()
  .then(() => {
    console.log("Generated dummy users and posts.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Unable to generate and insert dummy users and posts:", err);
    process.exit(1);
  });