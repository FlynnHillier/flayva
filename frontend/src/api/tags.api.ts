import { request } from "@/lib/network";
import { RecipeTag } from "@flayva-monorepo/shared/types";

export const tags = {
  getTagList: async () => {
    const response = await request({
      url: `/api/p/getTagList`,
      method: "GET",
    });
    
    // Return the data directly, as it seems to be an array-like object
    return response.data;
  }
};
