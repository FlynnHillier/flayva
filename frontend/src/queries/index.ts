import { mergeQueryKeys } from "@lukemorales/query-key-factory";

// Import all queries from the queries folder
import { test } from "./test";
import { auth } from "@/queries/auth.queries";
import { social } from "@/queries/social.queries";
import { recipe } from "@/queries/recipe.queries";
import { post } from "@/queries/post.queries";

export const queries = mergeQueryKeys(test, auth, social, recipe, post);
