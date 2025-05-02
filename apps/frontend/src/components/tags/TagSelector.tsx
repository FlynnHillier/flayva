// TagSelector.tsx
import type { RecipeTag } from "@flayva/types";
import { RECIPE_TAGS } from "@flayva/constants";
import Tag from "../tags/Tag";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type TagSelectorProps = {
  selectedTagIds: number[];
  onToggle: (tag: RecipeTag) => void;
  className?: string;
  categoryTextSize?: string;
};

export function TagSelector({
  selectedTagIds,
  onToggle,
  className,
  categoryTextSize = "text-lg",
}: TagSelectorProps) {
  // Categorise tags
  const categorisedTags = useMemo(
    () =>
      RECIPE_TAGS.reduce<Record<string, RecipeTag[]>>(
        (acc, tag) => ({
          ...acc,
          [tag.category]: acc[tag.category]
            ? [...acc[tag.category], tag]
            : [tag],
        }),
        {} as Record<string, RecipeTag[]>
      ),
    []
  );

  console.log("ss");

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      {Object.entries(categorisedTags).map(([category, tags]) => (
        <div key={category} className="mb-4">
          <h3
            className={cn(categoryTextSize, "font-semibold text-gray-600 mb-2")}
          >
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag
                key={tag.id}
                tag={tag}
                selected={selectedTagIds.includes(tag.id)}
                onClick={() => onToggle(tag)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
