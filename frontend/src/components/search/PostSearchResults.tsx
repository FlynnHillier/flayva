import { useEffect } from "react";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import PostPreview from "../post/PostPreview";
import { PostPreviewSkeleton } from "../post/PostPreview";
import { usePostSearchResult } from "./context/postSearchResults.context";
import { useSearchBar } from "./context/searchBar.context";
import { cn } from "@/lib/utils";

// Main component
export default function PostSearchResults() {
  const {
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    results,
  } = usePostSearchResult();

  const { showFilters } = useSearchBar();

  const { ref, inView } = useInView();

  // Error message
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
    <div
      className={cn(
        "w-full max-w-7xl p-3 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 place-items-center",
        {
          "lg:grid-cols-1 xl:grid-cols-2": showFilters,
        }
      )}
    >
      {results.map((preview) => (
        <PostPreview key={preview.id} preview={preview} showUser={true} />
      ))}

      {
        // If there are no posts and not fetching, show a message
        results.length === 0 && !isFetching && !error && (
          <div className="col-span-full text-center text-gray-500">
            No posts available.
          </div>
        )
      }
      {
        // If fetching, show skeleton loading indicators
        (isFetchingNextPage || isFetching) && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <PostPreviewSkeleton key={`skeleton-${index}`} showUser={true} />
            ))}
          </>
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
}
