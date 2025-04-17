import { usePost } from "@/contexts/post.context";
import { AddRecipeRatingForm } from "../ratings/add-recipe-rating-form";
import { RatingsInfiniteGrid } from "../ratings/ratings-infinite-grid";
import { useFetchPersonalRecipeRating } from "@/hooks/recipe.hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const PostFooter = () => {
  const { post } = usePost();

  const { data, error, isPending } = useFetchPersonalRecipeRating(
    post?.recipeId
  );

  return (
    <div className="w-full mt-6 border-t py-4 flex flex-col flex-nowrap items-center gap-y-4 mb-4">
      {isPending && (
        <div className="flex flex-col gap-2 w-full items-center">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-8 w-1/3" />
        </div>
      )}

      {data && data.rating !== null && (
        <div className="w-full flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold">
            Thanks for your feedback!
          </span>
          <span className="text-base text-gray-500">
            See what others have said below
          </span>
        </div>
      )}
      {data && data.rating === null && (
        <AddRecipeRatingForm recipeId={post?.recipeId} />
      )}
      {post && <RatingsInfiniteGrid recipeId={post.recipeId} />}
    </div>
  );
};
