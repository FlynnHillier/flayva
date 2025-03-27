// TODO: fix this import to correctly infer the type, replace all references to RecipeTag with the correct type, from the shared folder
// import { RecipeTag } from "@flayva-monorepo/shared/types";
import { tag } from "@flayva-monorepo/shared/validation";
import { z } from "zod";

export type RecipeTag = z.infer<typeof tag>;
