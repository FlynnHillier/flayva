import { insertDummyPosts } from "./post.data-insert";
import { insertDummyUsers } from "./user.data-insert";

export async function insertDummyData() {
  const dummyUsers = await insertDummyUsers(10);

  const userIds = dummyUsers.map((user) => user.id);

  await insertDummyPosts(userIds, { min: 1, max: 5 });
}

insertDummyData()
  .then(() => {
    console.log("Dummy data inserted successfully.");
  })
  .catch((error) => {
    console.error("Error inserting dummy data:", error);
  });
