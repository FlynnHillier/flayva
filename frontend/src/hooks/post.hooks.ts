import { api } from "@/api/api";
import { createConfigurableMutation } from "@/hooks/util/configurableMutation";
import { queries } from "@/queries";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

/**
 * Creates a new post
 * @returns The result of the creation
 */
export const useCreateNewPost = createConfigurableMutation(
  api.post.createNewPost,
  ["posts", "create"],
  {}
);

/**
 * Deletes an existing post
 * @param postId - The Id of the post to delete
 * @returns The result of the deletion
 */
export const useDeleteExistingPost = (postId: string) =>
  createConfigurableMutation(
    async () => await api.post.deleteExistingPost(postId),
    ["posts", "delete", postId],
    {}
  );

/**
 * Fetches a post by its Id
 * @param postId - The Id of the post to fetch
 * @returns The post with the given Id
 */
export const useGetPostById = (postId: string) => useQuery(queries.post.getPostById(postId));

/**
 * infinite scroll for post previews by the owner Id
 *
 * @param ownerId - The Id of the owner of the posts
 */
// TODO: perhaps add this to query-key-store
export const useInfiniteScrollProfilePostPreviews = (ownerId: string) =>
  useInfiniteQuery({
    queryKey: ["posts-preview", "profile", ownerId],
    queryFn: ({ pageParam }) => api.post.getInfiniteScrollPostPreviewsByOwnerId(ownerId, pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });
 
/**
 * infinite scroll for post previews by title and tags
 *
 * @param title - The title to search for
 * @param selectedTags - The selected tags to filter by
 */
export const useInfiniteScrollTitleAndTagsPostPreviews = (
  title: string,
  selectedTags: Record<string, string[]>
) =>
  useInfiniteQuery({
    queryKey: ["posts-preview", "title-tags", title, selectedTags],
    queryFn: ({ pageParam }) => 
      api.post.getInfiniteScrollPostPreviewsByTitleAndTags(title, selectedTags, pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });

/**
 * infinite scroll for user posts filtered by tags
 *
 * @param ownerId - The ID of the user
 * @param selectedTags - The selected tags to filter by
 */
export const useUserPostsWithTagFilters = (
  ownerId: string,
  selectedTags: Record<string, string[]>
) =>
  useInfiniteQuery({
    queryKey: ["posts-preview", "user-tags", ownerId, selectedTags],
    queryFn: ({ pageParam }) => 
      api.post.getUserPostsWithTagFilters(ownerId, selectedTags, pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });
