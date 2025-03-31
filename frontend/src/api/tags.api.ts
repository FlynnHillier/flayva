import { request } from "@/lib/network";
import { Tags } from "@flayva-monorepo/shared";

export async function FetchTags() {
    const { status, data } = await request({ url: `/api/s/t/}`, method: "GET" });
    
      if (status === 404 || !data.exists || !data.tags) {
        return { tags: undefined };
      }
    
      return { tags: data.tags as Tags };
}