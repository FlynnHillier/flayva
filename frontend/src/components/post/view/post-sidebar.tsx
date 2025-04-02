import { usePost } from "@/contexts/post.context";
import { cn } from "@/lib/utils";
import { Post } from "@flayva-monorepo/shared/types";
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
      <h2 className="text-xl font-semibold mb-4">{heading}</h2>
      {children}
    </section>
  );
}

function IngredientsSection({
  ingredients,
  className,
}: {
  ingredients: Post["recipe"]["ingredients"] | undefined;
  className?: ClassNameValue;
}) {
  const ingredientString = (ingredient: Exclude<typeof ingredients, undefined>[number]) => {
    const {
      amount_whole: whole,
      amount_fractional_denominator: denominator,
      amount_fractional_numerator: numerator,
      ingredientItem: { name },
      unit,
    } = ingredient;
    return `${whole > 0 ? whole : ""} ${
      numerator > 0 ? numerator + "/" + denominator : ""
    } ${unit} ${name}`;
  };

  return (
    <SideBarSection className={className} heading="Ingredients">
      <ul className="space-y-2">
        {ingredients?.map((ingredient, index) => (
          <li key={index} className="flex items-center">
            <input type="checkbox" id={`ingredient-${index}`} className="mr-3 w-5 h-5" />
            <label htmlFor={`ingredient-${index}`} className="text-gray-700">
              {ingredientString(ingredient)}
            </label>
          </li>
        ))}
      </ul>
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
      <ol className="list-decimal list-inside space-y-3 text-gray-700">
        {instructions?.map((instruction, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-gray-500">{index + 1}.</span>
            <p className="flex-1">{instruction.instruction}</p>
          </li>
        ))}
      </ol>
    </SideBarSection>
  );
}

export function PostSidebar({ className }: { className?: ClassNameValue }) {
  const { post } = usePost();

  return (
    <div className={cn("flex flex-col flex-nowrap space-y-0.5", className)}>
      <IngredientsSection ingredients={post?.recipe.ingredients} />
      <InstructionsSection instructions={post?.recipe.instructions} />
    </div>
  );
}
