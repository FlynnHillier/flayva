import { Skeleton } from "@/components/ui/skeleton";
import { usePost } from "@/contexts/post.context";
import { cn } from "@/lib/utils";
import { Post } from "@flayva-monorepo/shared/types";
import { useMemo } from "react";
import { ClassNameValue } from "tailwind-merge";

function SideBarSection({
  className,
  heading,
  children,
}: {
  className?: ClassNameValue;
  children: React.ReactNode;
  heading: string;
}) {
  return (
    <section className={cn("not-last:border-b-1 not-last:pb-4", className)}>
      <h2 className="text-xl lg:text-2xl font-semibold mb-4">{heading}</h2>
      {children}
    </section>
  );
}

const Ingredient = ({
  ingredient,
}: {
  ingredient: Exclude<Post["recipe"]["ingredients"], undefined>[number];
}) => {
  const {
    amount_whole: whole,
    amount_fractional_denominator: denominator,
    amount_fractional_numerator: numerator,
    ingredientItem: { name },
    unit,
  } = ingredient;

  const hasFraction = useMemo(() => denominator > 0 && numerator > 0, [denominator, numerator]);
  const hasWhole = useMemo(() => whole > 0, [whole]);

  return (
    <span className="text-base">
      <span className="font-medium ">
        {hasWhole && whole} {hasWhole && hasFraction && " "}
        {hasFraction && (
          <span className="text-sm">
            <sup>{numerator}</sup>/<sub>{denominator}</sub>
          </span>
        )}{" "}
        {unit}
      </span>{" "}
      {name.toLowerCase()}
    </span>
  );
};

function IngredientsSection({
  ingredients,
  className,
}: {
  ingredients: Post["recipe"]["ingredients"] | undefined;
  className?: ClassNameValue;
}) {
  return (
    <SideBarSection className={className} heading="Ingredients">
      {ingredients && (
        <ul className="space-y-2 list-inside list-disc pl-1">
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              <Ingredient ingredient={ingredient} />
            </li>
          ))}
        </ul>
      )}
      {!ingredients && (
        <div className="flex flex-col space-y-4 items-start">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-6 w-full max-w-64" />
          ))}
        </div>
      )}
    </SideBarSection>
  );
}

function InstructionsSection({
  instructions,
}: {
  instructions: Post["recipe"]["instructions"] | undefined;
}) {
  return (
    <SideBarSection heading="Instructions">
      {instructions && (
        <ol className="list-decimal list-inside space-y-4 pl-1">
          {instructions.map((instruction, index) => (
            <li key={index} className="flex items-start gap-2 ">
              <span className="font-medium ">{index + 1}.</span>
              <p className="flex-1">{instruction.instruction}</p>
            </li>
          ))}
        </ol>
      )}
      {!instructions && (
        <div className="flex flex-col space-y-4 items-start">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-full max-w-xl" />
          ))}
        </div>
      )}
    </SideBarSection>
  );
}

export function PostRecipeDetails({ className }: { className?: ClassNameValue }) {
  const { post } = usePost();

  return (
    <div className={cn("flex flex-col flex-nowrap space-y-0.5 w-full mt-6", className)}>
      <span className="text-2xl xl:text-3xl font-semibold mb-4">Recipe Details</span>
      <IngredientsSection ingredients={post?.recipe.ingredients} />
      <InstructionsSection instructions={post?.recipe.instructions} />
    </div>
  );
}
