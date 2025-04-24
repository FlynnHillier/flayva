import { createNewPost } from "@/server/services/post.services";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import fs from "fs";
import path from "path";
import { DATA_FOLDER_PATH } from "scripts/utils";
import { z } from "zod";

type ImagesFor = "burger" | "pizza" | "sushi" | "salad" | "dessert";

const DUMMY_POST_DATA: {
  imageType: ImagesFor;
  recipe: z.infer<typeof createNewPostSchema>["recipe"];
}[] = [
  {
    imageType: "burger",
    recipe: {
      title: "Burger King Burger",
      description: "A delicious burger with lettuce, tomato, and cheese.",
      ingredients: [],
      instructions: [
        { instruction: "Open the burger bun" },
        { instruction: "Add lettuce" },
        { instruction: "Add tomato" },
        { instruction: "Add cheese" },
        { instruction: "Close the burger bun" },
        { instruction: "Serve with fries" },
        { instruction: "Enjoy your meal!" },
        { instruction: "Don't forget to take a picture!" },
      ],
      tags: [
        {
          id: 21,
        },
        {
          id: 46,
        },
        {
          id: 59,
        },
        {
          id: 70,
        },
      ],
    },
  },
];

function getImageFiles(imagesFor: ImagesFor) {
  const IMAGE_DIRECTORY_PATH = path.join(
    DATA_FOLDER_PATH,
    "dummy",
    "posts",
    imagesFor
  );

  const files = fs.readdirSync(IMAGE_DIRECTORY_PATH);

  const imagefiles = files
    .filter((file) => /\.(jpg|jpeg|png)$/.test(file))
    .map((filename) => ({
      filename,
      filepath: path.join(IMAGE_DIRECTORY_PATH, filename),
    }));

  const imagesAsFileObjects = imagefiles.map(
    ({ filename, filepath }) => new File([fs.readFileSync(filepath)], filename)
  );

  return imagesAsFileObjects;
}

const getDummyPostData = (): z.infer<typeof createNewPostSchema> => {
  const randomDummyPostIndex = Math.floor(
    Math.random() * DUMMY_POST_DATA.length
  );

  const { imageType, recipe } = DUMMY_POST_DATA[randomDummyPostIndex];

  const imagesAsFileObjects = getImageFiles(imageType);

  return {
    images: imagesAsFileObjects,
    recipe,
  };
};

export const insertDummyPosts = async (
  userIds: string[],
  postsPerUser: { min: number; max: number }
) => {
  const dummyData = userIds.reduce<
    Record<string, z.infer<typeof createNewPostSchema>[]>
  >(
    (acc, userId) => ({
      ...acc,
      [userId]: Array.from(
        {
          length:
            Math.floor(
              Math.random() * (postsPerUser.max - postsPerUser.min + 1)
            ) + postsPerUser.min,
        },
        getDummyPostData
      ),
    }),
    {}
  );

  await Promise.all(
    Object.entries(dummyData).map(([userId, posts]) =>
      Promise.all(
        posts.map((post) =>
          createNewPost(userId, {
            images: post.images,
            recipe: post.recipe,
          })
        )
      )
    )
  );
};
