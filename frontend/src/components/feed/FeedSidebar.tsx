import { cn } from "@/lib/utils";
import { Post } from "@flayva-monorepo/shared/types";
import { useMemo } from "react";
import { ClassNameValue } from "tailwind-merge";
import { Ingredient } from "../post/view/post-recipe-details";
import { PostRating } from "../post/ratings/ratings-common";
import Tags from "../tags/Tags";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { UserCard } from "../common/profile.common";
import { Button } from "../ui/button";

const SidebarSection = ({
  header,
  isSkeleton,
  children,
}: React.PropsWithChildren<{ header: string; isSkeleton: boolean }>) => {
  return (
    <div className="flex flex-col gap-2 w-full h-fit rounded-lg">
      {isSkeleton ? (
        <Skeleton className="w-48 h-6" />
      ) : (
        <h2 className="text-lg font-semibold">{header}</h2>
      )}
      {children}
    </div>
  );
};

export const FeedSidebar = ({
  post,
  className,
  isTransitioning = false,
}: {
  className?: ClassNameValue;
  post: Post | undefined;
  isTransitioning: boolean;
}) => {
  const isSkeleton = useMemo(
    () => isTransitioning || !post,
    [isTransitioning, post]
  );

  return (
    <div
      className={cn(
        "border-x-2 py-7 px-4 flex flex-col space-y-2 h-full overflow-y-auto",
        className
      )}
    >
      {isSkeleton ? (
        <Skeleton className="w-48 h-8" />
      ) : (
        <span className="text-2xl font-semibold text-wrap">
          {post?.recipe.title}
        </span>
      )}
      <div className="text-sm text-muted-foreground">
        {isSkeleton ? (
          <div className="h-4 w-32 animate-pulse bg-muted rounded-full" />
        ) : (
          new Date(post?.created_at ?? "").toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        )}
      </div>
      {isSkeleton ? (
        <Skeleton className="w-32 h-6" />
      ) : (
        <PostRating
          rating={post?.recipe.ratings.statiststics.average}
          className={"mt-1"}
        />
      )}
      <div className="flex flex-col space-y-8 mt-2">
        <div className="flex">
          {isSkeleton ? (
            <div className="flex flex-row flex-wrap gap-y-1 gap-x-1">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="w-14 h-6 rounded-full" />
              ))}
            </div>
          ) : (
            <Tags tags={post?.recipe.tags} />
          )}
        </div>

        <SidebarSection header="Ingredients" isSkeleton={isSkeleton}>
          <ul
            className={cn("flex flex-col space-y-1", {
              "list-disc list-inside":
                !isSkeleton && post && post?.recipe.ingredients.length > 0,
            })}
          >
            {isSkeleton
              ? Array.from({ length: 4 }).map((_) => (
                  <li className="h-6 w-42 animate-pulse bg-muted rounded-full" />
                ))
              : post?.recipe.ingredients.map((ingredient) => (
                  <li
                    key={ingredient.ingredientItem.id}
                    className="text-sm font-semibold text-primary-foreground-foreground"
                  >
                    <Ingredient ingredient={ingredient} />
                  </li>
                ))}
            {!isSkeleton && post && post.recipe.ingredients.length === 0 && (
              <span className="text-muted-foreground text-sm">
                Oops! There doesn't seem to be any ingredients given for this
                recipe!
              </span>
            )}
          </ul>
        </SidebarSection>
        <SidebarSection header="Instructions" isSkeleton={isSkeleton}>
          <ol
            className={cn("flex flex-col space-y-1", {
              "list-decimal list-inside":
                !isSkeleton && post && post?.recipe.instructions.length > 0,
            })}
          >
            {isSkeleton
              ? Array.from({ length: 4 }).map((_) => (
                  <li className="h-6 w-42 animate-pulse bg-muted rounded-full" />
                ))
              : post?.recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2 ">
                    <span className="font-medium">{index + 1}.</span>
                    <p className="flex-1">{instruction.instruction}</p>
                  </li>
                ))}
            {!isSkeleton && post && post.recipe.instructions.length === 0 && (
              <span className="text-muted-foreground text-sm">
                Oops! There doesn't seem to be any instructions given for this
                recipe!
              </span>
            )}
          </ol>
        </SidebarSection>
      </div>
      <div className="flex justify-center mt-6">
        <Link
          to={{ pathname: `/p/${post?.id}` }}
          className={cn("inline-block ", {
            "opacity-50 pointer-events-none": isSkeleton,
          })}
        >
          <Button disabled={isSkeleton}>See full page view</Button>
        </Link>
      </div>
    </div>
  );
};
