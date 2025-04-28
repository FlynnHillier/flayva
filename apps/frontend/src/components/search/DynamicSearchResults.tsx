import { useSearchBar } from "./context/searchBar.context";
import UserSearchResults from "./UserSearchResults";
import PostSearchResults from "@/components/search/PostSearchResults";

export const DynamicSearchResults = () => {
  const { mode } = useSearchBar();

  return mode === "recipe" ? <PostSearchResults /> : <UserSearchResults />;
};
