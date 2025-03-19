import { request } from "@/lib/network";
import { Recipe } from "@flayva-monorepo/shared/types";

/**
 * Fetches the user's profile information from the server.
 */
export async function fetchRecipeById(
  id: string
): Promise<{ recipe?: Recipe }> {
  const { status, data } = await request({
    url: `/api/p/u/${id}`,
    method: "GET",
  });

  if (status === 404 || !data.exists || !data.user) {
    return { recipe: undefined };
  }

  return { recipe: data.recipe as Recipe };
}
