import { useInfiniteScrollTitleAndTagsPostPreviews } from "@/hooks/post.hooks";
import { PostPreview } from "@flayva-monorepo/shared/types";
import React, { ReactNode, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { useSearchBar } from "./searchBar.context";

type PostSearchResultsContextType = {
  results: PostPreview[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isFetching: boolean;
  hasNextPage: boolean;
  error: Error | null;
  isLoading: boolean;
};

const PostSearchResultsContext =
  React.createContext<PostSearchResultsContextType>(
    {} as PostSearchResultsContextType
  );

/**
 * Access the results of the post search.
 * This context provides the results of the search, as well as functions to fetch more results and check if there are more results to fetch.
 */
export const usePostSearchResult = () => {
  const context = React.useContext(PostSearchResultsContext);
  if (!context) {
    throw new Error(
      "usePostSearchResult must be used within a PostSearchProvider"
    );
  }
  return context;
};

export const PostSearchResultsProvider = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const { filterTagIds, searchQuery, mode } = useSearchBar();

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [debouncedFilterTagIds] = useDebounce(filterTagIds, 500);

  const {
    data,
    fetchNextPage,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
  } = useInfiniteScrollTitleAndTagsPostPreviews(
    debouncedSearchQuery,
    debouncedFilterTagIds,
    {
      enabled: mode === "recipe",
    }
  );

  const results = useMemo(
    () => (data ? data.pages.flatMap((page) => page.previews) : []),
    [data, data?.pages]
  );

  return (
    <PostSearchResultsContext.Provider
      value={{
        isFetching,
        fetchNextPage,
        results,
        hasNextPage,
        isFetchingNextPage,
        error,
        isLoading,
      }}
    >
      {children}
    </PostSearchResultsContext.Provider>
  );
};
