import { useSearchBar } from "./context/searchBar.context";
import UserSearchResults from "./UserSearch";
import PostSearchResults from "@/components/search/PostSearchResults";

export const DynamicSearchResults = () => {
  const { mode } = useSearchBar();

  return mode === "recipe" ? <PostSearchResults /> : <UserSearchResults />;
};
