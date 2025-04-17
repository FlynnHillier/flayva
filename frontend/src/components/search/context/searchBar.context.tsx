import React, { ReactNode, useEffect } from "react";

type SearchQueryContextType = {
  searchQuery: string;
  filterTagIds: number[];
  mode: "recipe" | "user";
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: React.Dispatch<React.SetStateAction<"recipe" | "user">>;
  setFilterTagIds: React.Dispatch<React.SetStateAction<number[]>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const SearchQueryContext = React.createContext<SearchQueryContextType>(
  {} as SearchQueryContextType
);

/**
 * Manage the state of the post search and filter.
 * This context provides the search query, filter tag IDs, and the results of the search.
 */
export const useSearchBar = () => {
  const context = React.useContext(SearchQueryContext);
  if (!context) {
    throw new Error("usePostSearch must be used within a PostSearchProvider");
  }
  return context;
};

export const SearchBarProvider = ({ children }: { children?: ReactNode }) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [filterTagIds, setFilterTagIds] = React.useState<number[]>([]);
  const [mode, setMode] = React.useState<"recipe" | "user">("recipe");
  const [showFilters, setShowFilters] = React.useState<boolean>(false);

  useEffect(() => {
    // Reset the search query when the mode changes
    setSearchQuery("");

    // Hide filters when switching to user mode
    if (mode === "user") setShowFilters(false);
  }, [mode]);

  return (
    <SearchQueryContext.Provider
      value={{
        showFilters,
        setShowFilters,
        mode,
        setMode,
        searchQuery,
        filterTagIds,
        setFilterTagIds,
        setSearchQuery,
      }}
    >
      {children}
    </SearchQueryContext.Provider>
  );
};
