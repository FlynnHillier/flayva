import { usePost } from "@/contexts/post.context";
import { AddRecipeRatingForm } from "../ratings/add-recipe-rating-form";

export const PostFooter = () => {
  const { post } = usePost();

  return (
    <div className="w-full mt-6 border-t py-4 flex flex-col flex-nowrap items-center">
      <AddRecipeRatingForm recipeId={post?.recipeId} />
    </div>
  );
};
