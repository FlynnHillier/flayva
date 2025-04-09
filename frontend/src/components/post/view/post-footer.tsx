import { usePost } from "@/contexts/post.context";
import { AddRecipeRatingForm } from "../ratings/add-recipe-rating-form";
import { RatingsInfiniteGrid } from "../ratings/ratings-infinite-grid";

export const PostFooter = () => {
  const { post } = usePost();

  return (
    <div className="w-full mt-6 border-t py-4 flex flex-col flex-nowrap items-center gap-y-4 mb-4">
      <AddRecipeRatingForm recipeId={post?.recipeId} />
      {post && <RatingsInfiniteGrid recipeId={post.recipeId} />}
    </div>
  );
};
