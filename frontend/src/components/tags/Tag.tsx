import { cn } from "@/lib/utils";
import { RecipeTag } from "@flayva-monorepo/shared/types";

export default function Tag({
  tag,
  selected = false,
  transparent = false,
  onClick,
}: {
  tag: RecipeTag;
  selected?: boolean;
  onClick?: () => void;
  transparent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        `flex items-center space-x-1 py-1 px-3 rounded-full text-sm border text-nowrap text-gray-700`,
        {
          "bg-blue-100/70 border-blue-300/70": selected && transparent,
          "bg-gray-100/70 border-gray-200/70": !selected && transparent,
          "bg-blue-100 border-blue-300": selected && !transparent,
          "bg-gray-100 border-gray-200": !selected && !transparent,
          "text-blue-700": selected,
        }
      )}
    >
      <span>{tag.emoji}</span>
      <span>{tag.name}</span>
    </button>
  );
}
