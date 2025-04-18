import { api } from "@/api/api";
import { createConfigurableMutation } from "@/hooks/util/configurableMutation";
import { setQueryData } from "@/lib/query";
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
export const useGetPostById = (postId: string) =>
  useQuery({ ...queries.post.getPostById(postId), enabled: !!postId });

/**
 * infinite scroll for post previews by the owner Id
 *
 * @param ownerId - The Id of the owner of the posts
 */
// TODO: perhaps add this to query-key-store
export const useInfiniteScrollProfilePostPreviews = (ownerId: string) =>
  useInfiniteQuery({
    queryKey: ["posts-preview", "profile", ownerId],
    queryFn: ({ pageParam }) =>
      api.post.getInfiniteScrollPostPreviewsByOwnerId(ownerId, pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });

/**
 * infinite scroll for post previews by title and tags
 *
 * @param title - The title to search for
 * @param selectedTags - The selected tags to filter by
 */
// TODO: perhaps add this to query-key-store
export const useInfiniteScrollTitleAndTagsPostPreviews = (
  title: string,
  tagIds: number[],
  { enabled = true }: { enabled?: boolean } = {}
) =>
  useInfiniteQuery({
    queryKey: ["posts-preview", "title-tags", title, tagIds],
    queryFn: ({ pageParam }) =>
      api.post.getInfiniteScrollPostPreviewsByTitleAndTags(
        title,
        tagIds,
        pageParam
      ),
    initialPageParam: 0,
    getNextPageParam: ({ nextCursor }) => nextCursor,
    enabled: enabled,
 })
                       
/**
 *
 *
 * INTERACTIONS
 *
 *
 */

/**
 * Fetches the like status of a post
 * @param postId - The Id of the post to fetch the like status for
 */
export const useLikePost = (postId: string) =>
  createConfigurableMutation(
    async () => await api.post.likePost(postId),
    ["posts", "interact", "like", postId],
    {
      onSuccess({ liked }, variables, context) {
        if (liked) {
          setQueryData(queries.post.getPostLikeStatus(postId), (__) => ({
            liked: true,
          }));

          setQueryData(
            queries.post.getPostById(postId),
            (post) =>
              post && {
                ...post,
                post: {
                  ...post.post,
                  likes: {
                    ...post.post.likes,
                    count: Number(post.post.likes.count) + 1,
                  },
                },
              }
          );
        }
      },
    }
  );

export const useUnlikePost = (postId: string) =>
  createConfigurableMutation(
    async () => await api.post.unlikePost(postId),
    ["posts", "interact", "unlike", postId],
    {
      onSuccess({ unliked }, variables, context) {
        if (unliked) {
          setQueryData(queries.post.getPostLikeStatus(postId), (_) => ({
            liked: false,
          }));

          setQueryData(
            queries.post.getPostById(postId),
            (post) =>
              post && {
                ...post,
                post: {
                  ...post.post,
                  likes: {
                    ...post.post.likes,
                    count: Number(post.post.likes.count) - 1,
                  },
                },
              }
          );
        }
      },
    }
  );

export const useGetPostLikeStatus = (postId: string) =>
  useQuery({
    ...queries.post.getPostLikeStatus(postId),
    enabled: !!postId,
  });
