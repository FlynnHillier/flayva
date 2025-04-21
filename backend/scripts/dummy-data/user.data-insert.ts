import { db } from "@/db";
import { users } from "@/db/schema";

function generateRandomUserName() {
  const firstNames = [
    "John",
    "Jane",
    "Alex",
    "Emily",
    "Chris",
    "Katie",
    "Michael",
    "Sarah",
    "David",
    "Laura",
    "James",
    "Jessica",
    "Daniel",
    "Sophia",
    "Matthew",
    "Olivia",
    "Andrew",
    "Mia",
    "Joshua",
    "Ava",
    "Ryan",
    "Isabella",
    "Ethan",
    "Charlotte",
    "Jacob",
    "Amelia",
    "William",
    "Harper",
    "Benjamin",
    "Ella",
    "Samuel",
    "Grace",
    "Henry",
    "Chloe",
    "Lucas",
    "Liam",
    "Sofia",
    "Jackson",
    "Victoria",
    "Aiden",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
    "Clark",
    "Rodriguez",
    "Lewis",
    "Lee",
    "Walker",
    "Hall",
    "Allen",
    "Young",
    "Hernandez",
    "King",
    "Wright",
  ];

  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${randomFirstName} ${randomLastName}`;
}

const generateRandomUserDetails = () => ({
  username: generateRandomUserName(),
  profile_picture_url: `https://rickandmortyapi.com/api/character/avatar/${Math.floor(
    Math.random() * 826
  )}.jpeg`,
  bio: "Hey! I'm a random user. Nice to meet you!",
});

export async function insertDummyUsers(count: number = 10) {
  const userDummyData = Array.from({ length: count }, () =>
    generateRandomUserDetails()
  );

  const insertedUsers = await db
    .insert(users)
    .values(userDummyData)
    .returning();

  return insertedUsers;
}
