import { USER_ID_LENGTH } from "@/constants/auth.constants";
import { db } from "@/db";
import { ingredient_items, posts, recipe_ingredients, recipe_instruction_steps, recipe_meta_infos, recipes, users } from "@/db/schema";
import { POST, RECIPE } from "@flayva-monorepo/shared/constants";
import { nanoid } from "nanoid";
import { createPost } from "@/server/controllers/post.controllers";

const mockUsers: Omit<typeof users.$inferInsert, "id">[] = [
    {
        username: "John Smith",
        profile_picture_url: "https://picsum.photos/seed/user1/200",
        bio: "Cooking is my passion!",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        username: "Jane Doe",
        profile_picture_url: "https://picsum.photos/seed/user2/200",
        bio: "Italian food is goated",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        username: "Test Tester",
        profile_picture_url: "https://picsum.photos/seed/user3/200",
        bio: "Mukbang Master",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        username: "Jerry Atric",
        profile_picture_url: "https://picsum.photos/seed/user4/200",
        bio: "An old man just looking for recipes",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        username: "Peter Griffin",
        profile_picture_url: "https://picsum.photos/seed/user1/200",
        bio: "Sharing my recipes with the world",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
]

const mockRecipes: Omit<typeof recipes.$inferInsert, "id">[] = Array.from({ length: 5 }).map((_, i) => ({
    title: `Mock Recipe ${i + 1}`,
    description: `This is a description for Mock Recipe ${i + 1}.`,
    created_at: new Date().toISOString(),
  }));



  export async function dbInsertMockSocialData() {
    const insertedUsers = await Promise.all(
      mockUsers.map(async (user) => {
        const id = nanoid(USER_ID_LENGTH);
        await db
          .insert(users)
          .values({ ...user, id })
          .onConflictDoNothing();
        return { ...user, id };
      })
    );
  
    const insertedRecipes = await Promise.all(
      mockRecipes.map(async (recipe) => {
        const id = nanoid(RECIPE.RECIPE_ID_LENGTH);
        await db
          .insert(recipes)
          .values({ ...recipe, id })
          .onConflictDoNothing();
        return { ...recipe, id };
      })
    );
  
    const postEntries: typeof posts.$inferInsert[] = insertedUsers.map((user, i) => ({
      id: nanoid(POST.POST_ID_LENGTH),
      ownerId: user.id,
      recipeId: insertedRecipes[i].id,
      created_at: new Date().toISOString(),
    }));

    await db.insert(posts).values(postEntries).onConflictDoNothing();

    const metaData: typeof recipe_meta_infos.$inferInsert[] = insertedRecipes.map((r, i) => ({
        recipeId: r.id,
        estimatedCookTime: `${10 + i * 5} mins`,
        estimatedPrepTime: `${10 + i * 2} mins`,
        servings: 2 + i,

    }))
  
    await db.insert(recipe_meta_infos).values(metaData).onConflictDoNothing();

    const instructions: typeof recipe_instruction_steps.$inferInsert[] = insertedRecipes.flatMap((r, i) => [
        {
          recipeId: r.id,
          stepNumber: 1,
          instruction: `Step 1 for ${r.title}: Gather ingredients.`,
        },
        {
          recipeId: r.id,
          stepNumber: 2,
          instruction: `Step 2 for ${r.title}: Start cooking.`,
        },
      ]);
      
    await db.insert(recipe_instruction_steps).values(instructions).onConflictDoNothing();
      

    const existingIngredients = await db.select().from(ingredient_items).limit(5);
    if(existingIngredients.length != 0) {
    const recipeIngredients: typeof recipe_ingredients.$inferInsert[] = insertedRecipes.map((r, i) => ({
        recipe_id: r.id,
        ingredient_id: existingIngredients[i % existingIngredients.length].id,
        amount_whole: 1 + i,
        amount_fractional_numerator: 1,
        amount_fractional_denominator: 2,
        unit: RECIPE.INGREDIENT_UNITS[i % RECIPE.INGREDIENT_UNITS.length],
    }));
    
    await db.insert(recipe_ingredients).values(recipeIngredients).onConflictDoNothing();
}
  }