import { useQuery } from "@tanstack/react-query";
import { tags } from '@/queries/tags.queries';

export function useGetTagList() {
  return useQuery({
    ...tags.getTagList()
  });
}
