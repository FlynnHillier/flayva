import { X } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { RECIPE } from "@flayva-monorepo/shared/constants";
import { RecipeTag } from "@flayva-monorepo/shared/types";
import { useSearchBar } from "./context/searchBar.context";
import Tag from "../tags/Tag";
import { cn } from "@/lib/utils";

/**
 * A component that displays a list of tags for filtering recipes.
 * It categorizes tags into different sections and allows users to select or deselect tags.
 */
function TagsFilter() {
  const isMobile = useIsMobile();
  const { setFilterTagIds, filterTagIds } = useSearchBar();

  const categorisedTags = RECIPE.RECIPE_TAGS.reduce<
    Record<string, RecipeTag[]>
  >(
    (acc, tag) => ({
      ...acc,
      [tag.category]: acc[tag.category] ? [...acc[tag.category], tag] : [tag],
    }),
    {} as Record<string, RecipeTag[]>
  );

  const toggleTagIsSelected = (tag: RecipeTag) => {
    setFilterTagIds((prev) => {
      if (prev.includes(tag.id)) {
        return prev.filter((id) => id !== tag.id);
      }
      return [...prev, tag.id];
    });
  };

  return (
    <div
      className={cn("h-full overflow-y-auto", {
        // "flex-grow": !isMobile,
      })}
    >
      {Object.entries(categorisedTags).map(([category, tags]) => (
        <div key={category} className={isMobile ? "mb-2" : "mb-4"}>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag
                key={tag.id}
                tag={tag}
                selected={filterTagIds.includes(tag.id)}
                onClick={() => toggleTagIsSelected(tag)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Mobile view for tag search filters.
 */
function TagSearchFiltersDrawerView() {
  const { setShowFilters, showFilters } = useSearchBar();

  const onClose = () => setShowFilters(false);

  return (
    // Full-screen fixed overlay with high z-index to appear above other content
    <div
      className={cn("fixed inset-0 z-50 bg-white flex flex-col", {
        hidden: !showFilters,
      })}
    >
      {/* Header with title and close button */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-medium">Filters</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Close filters"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main content area with scrollable filter options */}
      <div className="flex-1 overflow-auto p-4">
        <TagsFilter />
      </div>
    </div>
  );
}

function TagSearchFiltersSidebarView() {
  const { showFilters } = useSearchBar();

  return (
    <div
      className={cn(
        "transition-all duration-300 w-64 xl:w-80 box-border h-full block overflow-hidden pb-6",
        {
          "w-0 xl:w-0": !showFilters,
        }
      )}
    >
      <div className="max-w-full h-full pb-6">
        <div className="text-center mb-2 text-gray-500 font-medium text-2xl">
          Filters
        </div>
        <TagsFilter />
      </div>
    </div>
  );
}

export const TagSearchFilter = () => {
  const isMobile = useIsMobile();

  if (isMobile) return <TagSearchFiltersDrawerView />;

  return <TagSearchFiltersSidebarView />;
};
