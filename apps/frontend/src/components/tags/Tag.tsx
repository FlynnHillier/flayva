import { cn } from "@/lib/utils";
import type { RecipeTag } from "@flayva/types";
import { ClassNameValue } from "tailwind-merge";

export default function Tag({
  tag,
  selected = false,
  transparent = false,
  onClick,
  className,
}: {
  tag: RecipeTag;
  selected?: boolean;
  onClick?: () => void;
  transparent?: boolean;
  className?: ClassNameValue;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        `flex items-center space-x-1 py-1 px-2 rounded-full text-xs @md:text-sm border text-nowrap text-gray-700`,
        {
          "bg-blue-100/70 border-blue-300/70": selected && transparent,
          "bg-gray-100/70 border-gray-200/70": !selected && transparent,
          "bg-blue-100 border-blue-300": selected && !transparent,
          "bg-gray-100 border-gray-200": !selected && !transparent,
          "text-blue-700": selected,
        },
        className
      )}
    >
      <span>{tag.emoji}</span>
      <span>{tag.name}</span>
    </button>
  );
}
