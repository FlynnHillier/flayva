import { request } from "@/lib/network";
import { RecipeTag } from "@flayva/types";

export const tags = {
  getTagList: async () => {
    const { data } = await request({
      url: `/api/p/getTagList`,
      method: "GET",
    });

    // Return the data directly, as it seems to be an array-like object
    return data as RecipeTag[];
  },
};
