import { createNewPost } from "@/server/services/post.services";
import { createNewPostSchema } from "@flayva-monorepo/shared/validation/post.validation";
import fs from "fs";
import path from "path";
import { DATA_FOLDER_PATH } from "scripts/utils";
import { z } from "zod";

type ImagesFor =
  | "burger"
  | "pizza"
  | "sushi"
  | "salad"
  | "pancakes"
  | "steak"
  | "spaghetti"
  | "roast-dinner";

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
  {
    imageType: "pizza",
    recipe: {
      title: "Margherita Magic Pizza",
      description: "Classic Italian pizza with fresh basil and mozzarella",
      ingredients: [],
      instructions: [
        { instruction: "Preheat oven to 250°C" },
        { instruction: "Stretch pizza dough" },
        { instruction: "Add tomato sauce" },
        { instruction: "Top with mozzarella" },
        { instruction: "Bake for 8-10 minutes" },
      ],
      tags: [{ id: 12 }, { id: 34 }, { id: 55 }],
    },
  },
  {
    imageType: "sushi",
    recipe: {
      title: "Sushi Supreme Platter",
      description: "Assortment of fresh nigiri and maki rolls",
      ingredients: [],
      instructions: [
        { instruction: "Prepare sushi rice" },
        { instruction: "Slice fresh fish" },
        { instruction: "Assemble nigiri pieces" },
        { instruction: "Roll maki with bamboo mat" },
      ],
      tags: [{ id: 17 }, { id: 63 }],
    },
  },
  {
    imageType: "salad",
    recipe: {
      title: "Summer Berry Salad",
      description: "Mixed greens with seasonal berries and balsamic glaze",
      ingredients: [],
      instructions: [
        { instruction: "Wash salad leaves" },
        { instruction: "Slice strawberries" },
        { instruction: "Add blueberries" },
        { instruction: "Drizzle with dressing" },
      ],
      tags: [{ id: 45 }, { id: 21 }],
    },
  },
  {
    imageType: "pancakes",
    recipe: {
      title: "Fluffy Buttermilk Stack",
      description: "Light and airy pancakes with maple syrup",
      ingredients: [],
      instructions: [
        { instruction: "Mix dry ingredients" },
        { instruction: "Whisk in buttermilk" },
        { instruction: "Cook on griddle" },
        { instruction: "Stack and serve" },
      ],
      tags: [{ id: 33 }, { id: 19 }, { id: 42 }, { id: 56 }],
    },
  },
  {
    imageType: "steak",
    recipe: {
      title: "Perfect Ribeye Steak",
      description: "Juicy ribeye cooked to medium-rare perfection",
      ingredients: [],
      instructions: [
        { instruction: "Season steak generously" },
        { instruction: "Sear in cast iron" },
        { instruction: "Baste with butter" },
        { instruction: "Rest before slicing" },
      ],
      tags: [{ id: 68 }, { id: 14 }, { id: 29 }],
    },
  },
  {
    imageType: "spaghetti",
    recipe: {
      title: "Sunday Night Bolognese",
      description: "Hearty meat sauce over al dente pasta",
      ingredients: [],
      instructions: [
        { instruction: "Brown ground beef" },
        { instruction: "Simmer tomato sauce" },
        { instruction: "Cook spaghetti" },
        { instruction: "Combine and serve" },
      ],
      tags: [{ id: 5 }, { id: 38 }, { id: 44 }, { id: 51 }],
    },
  },
  {
    imageType: "roast-dinner",
    recipe: {
      title: "Sunday Roast Feast",
      description: "Traditional roast beef with all the trimmings",
      ingredients: [],
      instructions: [
        { instruction: "Season beef joint" },
        { instruction: "Roast potatoes" },
        { instruction: "Prepare Yorkshire puddings" },
        { instruction: "Make gravy from drippings" },
      ],
      tags: [{ id: 27 }, { id: 39 }, { id: 61 }, { id: 72 }],
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
