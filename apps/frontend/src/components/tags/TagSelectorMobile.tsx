// TagSelectorMobile.tsx
import { X } from "lucide-react";
import { useSearchBar } from "../search/context/searchBar.context";
import { TagSelector } from "./TagSelector";
import { cn } from "@/lib/utils";
import { RecipeTag } from "@flayva/types";

export function TagSelectorMobile() {
  const { setShowFilters, showFilters, setFilterTagIds, filterTagIds } =
    useSearchBar();

  const onClose = () => setShowFilters(false);

  const toggleTagIsSelected = (tag: RecipeTag) => {
    setFilterTagIds((prev) =>
      prev.includes(tag.id)
        ? prev.filter((id) => id !== tag.id)
        : [...prev, tag.id]
    );
  };

  return (
    <div
      className={cn("fixed inset-0 z-50 bg-white flex flex-col", {
        hidden: !showFilters,
      })}
    >
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
      <div className="flex-1 overflow-auto p-4">
        <TagSelector
          selectedTagIds={filterTagIds}
          onToggle={toggleTagIsSelected}
        />
      </div>
    </div>
  );
}
