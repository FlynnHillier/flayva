// TagSelectorSidebar.tsx
import { RecipeTag } from "@flayva/types";
import { useSearchBar } from "../search/context/searchBar.context";
import { TagSelector } from "./TagSelector";
import { cn } from "@/lib/utils";

export function TagSelectorRegular() {
  const { showFilters, setFilterTagIds, filterTagIds } = useSearchBar();

  const toggleTagIsSelected = (tag: RecipeTag) => {
    setFilterTagIds((prev) =>
      prev.includes(tag.id)
        ? prev.filter((id) => id !== tag.id)
        : [...prev, tag.id]
    );
  };

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
        <TagSelector
          selectedTagIds={filterTagIds}
          onToggle={toggleTagIsSelected}
        />
      </div>
    </div>
  );
}
