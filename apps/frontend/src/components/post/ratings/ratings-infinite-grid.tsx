import {
  useFetchPersonalRecipeRating,
  useRecipeRatingsPagination,
} from "@/hooks/recipe.hooks";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { RecipeRatingView } from "./rating";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FourSquare } from "react-loading-indicators";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import type { RecipeRating } from "@flayva/backend-types";

export const RatingsInfiniteGrid = ({
  recipeId,
  className,
}: {
  recipeId: string;
  className?: ClassNameValue;
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
    isFetchingNextPage,
    isFetched,
  } = useRecipeRatingsPagination(recipeId);

  const { data: ownRating } = useFetchPersonalRecipeRating(recipeId);

  const ratings = useMemo<RecipeRating[]>(
    () => [
      // Always display the own rating first, if it exists
      ...(ownRating?.rating ? [ownRating.rating] : []),
      ...(data
        ? data.pages.flatMap((page) =>
            page.ratings.filter((rating) => rating.id !== ownRating?.rating?.id)
          )
        : []),
    ],
    [data?.pages]
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
    <div
      className={cn(
        "w-full max-w-7xl p-3 grid auto-rows-auto grid-cols-1 lg:grid-cols-2 gap-3 items-stretch place-items-center",
        className
      )}
    >
      {ratings.map((rating) => (
        <RecipeRatingView
          key={rating.id}
          rating={rating}
          className="w-full h-full"
        />
      ))}
      {
        // If there are no posts and not fetching, show a message
        ratings.length === 0 && !isFetching && !error && (
          <div className="col-span-full text-center text-gray-500">
            There are not yet any reviews for this recipe. <br /> Why not be the
            first?
          </div>
        )
      }
      {
        // If fetching, show a loading indicator
        (isFetchingNextPage || !isFetched) && (
          <div className="col-span-full text-center text-gray-500">
            <FourSquare color={"gray"} size={"small"} />
          </div>
        )
      }
      {error && (
        <div className="col-span-full text-center text-gray-500 flex flex-col items-center gap-2">
          <span className="text-red-500">Error loading reviews</span>
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
