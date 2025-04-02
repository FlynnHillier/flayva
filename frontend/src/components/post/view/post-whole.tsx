import { PostBody } from "./post-body";
import { PostHeader } from "./post-header";
import { PostRecipeDetails } from "./post-recipe-details";

export function PostView() {
  return (
    <div className="flex flex-col  max-w-5xl px-6 py-3 w-full">
      <PostHeader />
      <PostBody />
      <PostRecipeDetails />
    </div>
  );
}
