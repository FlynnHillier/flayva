import { useProfile } from "@/contexts/profile.context";
import { useInfiniteScrollProfilePostPreviews } from "@/hooks/post.hooks";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { FourSquare } from "react-loading-indicators";
import { Button } from "@/components/ui/button";
import PostPreview, { PostPreviewSkeleton } from "../post/PostPreview";

export const ProfileContent = () => {
  const { profile } = useProfile();

  if (!profile) return null;

  const {
    data,
    fetchNextPage,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isFetched,
    isLoading,
  } = useInfiniteScrollProfilePostPreviews(profile.user.id);

  const previews = useMemo(
    () => (data ? data.pages.flatMap((page) => page.previews) : []),
    [data, data?.pages]
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (error)
      toast.error(
        error.message ?? "Something went wrong while attempting to load posts"
      );
  }, [error]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) fetchNextPage();
  }, [inView, hasNextPage, isFetching]);

  return (
    <div className="w-full max-w-7xl p-3 grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-4  gap-3  place-items-center">
      {previews.map((preview) => (
        <PostPreview key={preview.id} preview={preview} showUser={false} />
      ))}
      {
        // If there are no posts and not fetching, show a message
        previews.length === 0 && !isFetching && !error && (
          <div className="col-span-full text-center text-gray-500">
            No posts available for this profile.
          </div>
        )
      }

      {isLoading &&
        Array.from({ length: 4 }).map((_, index) => (
          <PostPreviewSkeleton key={index} />
        ))}

      {
        // If fetching, show a loading indicator
        ((!isLoading && isFetchingNextPage) || !isFetched) && (
          <div className="col-span-full text-center text-gray-500">
            <FourSquare color={"gray"} size={"small"} />
          </div>
        )
      }
      {error && (
        <div className="col-span-full text-center text-gray-500 flex flex-col items-center gap-2">
          <span className="text-red-500">Error loading posts</span>
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            Retry
          </Button>
        </div>
      )}

      <div ref={ref} className="w-full h-[1px]" />
    </div>
  );
};
