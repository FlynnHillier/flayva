import { CookingPot, Search, Users, Filter } from "lucide-react";
import { useSearchBar } from "./context/searchBar.context";
import { Switch } from "@components/ui/switch";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * Toggle button to switch between recipe and user search modes.
 */
export function ToggleSearchMode() {
  const { mode, setMode } = useSearchBar();

  const toggleMode = useCallback(
    () => setMode((prev) => (prev === "recipe" ? "user" : "recipe")),
    [setMode]
  );

  return (
    <div className="flex items-center gap-3 p-2 justify-center">
      {/* Recipe icon - highlighted when in recipe search mode */}
      <CookingPot
        className={cn("size-5 text-muted-foreground", {
          "text-primary": mode === "recipe",
        })}
      />

      {/* Toggle switch */}
      <Switch
        checked={mode === "user"}
        onCheckedChange={toggleMode}
        className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer"
      />

      {/* User icon - highlighted when in user search mode */}
      <Users
        className={cn("size-5 text-muted-foreground", {
          "text-primary": mode === "user",
        })}
      />
    </div>
  );
}

/**
 * Search bar component for entering search queries.
 * Includes a toggle button for filters when in recipe search mode.
 */
export function SearchBar() {
  const { setSearchQuery, searchQuery, setShowFilters, showFilters, mode } =
    useSearchBar();

  const toggleShowFilter = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, [setShowFilters]);

  return (
    <div className="w-full border-2 p-2 rounded-lg flex items-center max-w-2xl">
      <Search className="text-muted-foreground size-7" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
        //   placeholder={`Search for ${current ? "recipes" : "users"}...`}
        className="w-full p-2 rounded-md outline-none"
      />
      {/* Only show filter button when in recipe search mode */}
      <button
        onClick={toggleShowFilter}
        className={cn(
          "ml-2 p-1 rounded-md group hover:cursor-pointer transition-opacity duration-300",
          {
            "opacity-0 pointer-events-none": mode !== "recipe",
          }
        )}
        aria-label="Toggle filters"
      >
        <Filter
          className={cn("text-muted-foreground group-hover:text-primary ", {
            "text-primary": showFilters,
          })}
        />
      </button>
    </div>
  );
}
