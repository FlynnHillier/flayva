import { SearchBar, ToggleSearchMode } from "@/components/search/SearchBar";
import { SearchBarProvider } from "@/components/search/context/searchBar.context";
import { PostSearchResultsProvider } from "@/components/search/context/postSearchResults.context";
import { DynamicSearchResults } from "@/components/search/DynamicSearchResults";
import { TagSearchFilter } from "@/components/search/TagSearchFilter";

// Main search component
export default function SearchPage() {
  return (
    <SearchBarProvider>
      <PostSearchResultsProvider>
        {/* Main search container */}
        <div className="h-screen w-full rounded-md p-4 flex flex-row max-w-7xl gap-5 overflow-y-hidden ">
          <div className="flex flex-col gap-4 flex-grow">
            {/* Search controls section */}
            <div className="w-full flex flex-row items-center justify-center gap-5">
              <ToggleSearchMode />
              <SearchBar />
            </div>
            {/* Search results section */}
            <div className="flex-grow flex flex-col overflow-y-auto mt-5 max-h-full ">
              <DynamicSearchResults />
            </div>
          </div>
          <TagSearchFilter />
        </div>
      </PostSearchResultsProvider>
    </SearchBarProvider>
  );
}
