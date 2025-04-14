import { useEffect } from 'react';
import Tag from '@/components/tags/Tag';
import { RecipeTag } from '@flayva-monorepo/shared/types';
import { RECIPE } from '@flayva-monorepo/shared/constants';

interface TagsProps {
  visible: boolean;
  selectedTags: Record<string, string[]>;
  setSelectedTags: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  lastFilters: Record<string, string[]>;
  setLastFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  showApplyLastFilters: boolean;
  setShowApplyLastFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Tags({
  visible = true,
  selectedTags,
  setSelectedTags,
  lastFilters,
  setLastFilters,
  showApplyLastFilters,
  setShowApplyLastFilters
}: TagsProps) {
  // Group tags by category
  const categorisedTags = RECIPE.RECIPE_TAGS.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push({
      id: `${tag.category}-${tag.name}`,
      tagName: tag.name,
      category: tag.category,
      emoji: tag.emoji,
    });
    return acc;
  }, {} as Record<string, RecipeTag[]>);

  // Toggle tag selection
  const toggleTag = (tag: RecipeTag) => {
    setSelectedTags((prev) => {
      // Create a deep copy of the previous state
      const newSelectedTags = { ...prev };

      // Initialize the category array if it doesn't exist
      if (!newSelectedTags[tag.category]) {
        newSelectedTags[tag.category] = [];
      } else {
        // Create a new array to avoid mutation issues
        newSelectedTags[tag.category] = [...newSelectedTags[tag.category]];
      }

      // Check if the tag is already selected
      const isSelected = newSelectedTags[tag.category].includes(tag.tagName);

      if (isSelected) {
        // If tag is already selected, remove it
        newSelectedTags[tag.category] = newSelectedTags[tag.category].filter(
          (name) => name !== tag.tagName
        );

        // Remove empty categories
        if (newSelectedTags[tag.category].length === 0) {
          delete newSelectedTags[tag.category];
        }
      } else {
        // If tag is not selected, add it
        newSelectedTags[tag.category].push(tag.tagName);
      }

      return newSelectedTags;
    });
  };

  // Apply last filters
  const applyLastFilters = () => {
    setSelectedTags(lastFilters);
    setShowApplyLastFilters(false);
  };

  // Apply current filters
  const applyFilters = () => {
    setLastFilters({ ...selectedTags });
    // Here you would typically trigger a search with the selected filters
    console.log('Applying filters:', selectedTags);
  };

  // Check if a tag is selected
  const isTagSelected = (tag: RecipeTag) => {
    return selectedTags[tag.category]?.includes(tag.tagName) || false;
  };

  // For debugging
  useEffect(() => {
    console.log('Selected tags updated:', selectedTags);
  }, [selectedTags]);

  // Use CSS classes to control visibility and width
  const containerClasses = `${
    visible 
      ? 'w-2/12 opacity-100' 
      : 'w-0 opacity-0 p-0 border-0 overflow-hidden'
  } h-9/12 border-2 border-[#e5e5e5] rounded-md p-4 flex flex-col transition-all duration-300`;

  return (
    <div className={containerClasses}>
      <div className="text-center mb-2 text-gray-500 font-medium">Filters</div>


      {/* Filter Categories */}
      <div className="flex-grow overflow-auto space-y-4">
        {Object.entries(categorisedTags).map(([category, tags]) => (
          <div key={category} className="mb-4">
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
    </div>
  );
}
