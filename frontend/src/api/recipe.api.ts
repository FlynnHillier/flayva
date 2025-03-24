import { request } from "@/lib/network";
import { RecipeTag } from "@flayva-monorepo/shared/types";

export const querySuggestedSimilarTags = async (tagQuery: string) => {
  const { data } = await request({ url: `/api/d/r/tags/q/${tagQuery}`, method: "GET" });

  return data.tags as RecipeTag[];
};
