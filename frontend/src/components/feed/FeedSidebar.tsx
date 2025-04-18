import { cn } from "@/lib/utils";
import { Post } from "@flayva-monorepo/shared/types";
import { useMemo } from "react";
import { ClassNameValue } from "tailwind-merge";
import { UserCard } from "../common/profile.common";
import { Ingredient } from "../post/view/post-recipe-details";

const SidebarSection = ({
  header,
  children,
}: React.PropsWithChildren<{ header: string }>) => {
  return (
    <div className="flex flex-col gap-2 w-full h-fit rounded-lg">
      <h2 className="text-2xl font-semibold">{header}</h2>
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
      className={cn("border-x-2 py-4 px-2 flex flex-col space-y-4", className)}
    >
      <UserCard user={isSkeleton ? undefined : post?.owner} />
      <span className="Recipe text-3xl font-semibold">Recipe</span>
      <div className="flex flex-col space-y-8 mt-2">
        <SidebarSection header="Ingredients">
          <ul className="flex flex-col space-y-2 list-disc list-inside">
            {isSkeleton
              ? Array.from({ length: 4 }).map((_) => (
                  <li className="h-6 w-42 animate-pulse bg-muted rounded-full" />
                ))
              : post?.recipe.ingredients.map((ingredient) => (
                  <li
                    key={ingredient.ingredientItem.id}
                    className="text-base font-semibold text-primary-foreground-foreground"
                  >
                    <Ingredient ingredient={ingredient} />
                  </li>
                ))}
          </ul>
        </SidebarSection>
        <SidebarSection header="Instructions">
          <ol className="list-decimal list-inside space-y-4 pl-1">
            {isSkeleton
              ? Array.from({ length: 4 }).map((_) => (
                  <li className="h-6 w-42 animate-pulse bg-muted rounded-full" />
                ))
              : post?.recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2 ">
                    <span className="font-medium ">{index + 1}.</span>
                    <p className="flex-1">{instruction.instruction}</p>
                  </li>
                ))}
          </ol>
        </SidebarSection>
      </div>
    </div>
  );
};
