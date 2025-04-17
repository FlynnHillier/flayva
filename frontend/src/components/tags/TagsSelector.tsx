import Tag from "@/components/tags/Tag";
import { RecipeTag } from "@flayva-monorepo/shared/types";
import { RECIPE } from "@flayva-monorepo/shared/constants";

interface TagsSelectorProps {
  selectedTagIds: number[];
  setSelectedTagIds: React.Dispatch<React.SetStateAction<number[]>>;
  compact?: boolean;
  className?: string;
}

export default function TagsSelector({
  selectedTagIds,
  setSelectedTagIds,
  compact = false,
  className = "",
}: TagsSelectorProps) {
  // Group tags by category

  // TODO: fetch tags instead of using constant directly
  const categorisedTags = RECIPE.RECIPE_TAGS.reduce((acc, tag, i) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push({
      id: tag.id,
      name: tag.name,
      category: tag.category,
      emoji: tag.emoji,
    });
    return acc;
  }, {} as Record<string, RecipeTag[]>);

  // Toggle tag selection
  const toggleTag = (tag: RecipeTag) => {
    setSelectedTagIds((prev) => {
      if (prev.includes(tag.id)) {
        return prev.filter((id) => id !== tag.id);
      }
      return [...prev, tag.id];
    }); // Remove duplicates
  };

  // Check if a tag is selected
  const isTagSelected = (tag: RecipeTag) => {
    return selectedTagIds.includes(tag.id) || false;
  };

  return (
    <div className={`${className} ${compact ? "space-y-2" : "space-y-4"}`}>
      {Object.entries(categorisedTags).map(([category, tags]) => (
        <div key={category} className={compact ? "mb-2" : "mb-4"}>
          <h3 className="text-sm text-gray-600 mb-2">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag
                key={tag.id}
                tag={tag}
                selected={isTagSelected(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
