import { useGetPostById } from "@/hooks/post.hooks";
import type { Post } from "@flayva/backend-types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface PostViewContextType {
  post?: Post;
  fetchPost: (postId: string) => void;
  isLoading: boolean;
  error?: Error;
}

const PostContext = createContext<PostViewContextType>({
  post: undefined,
  fetchPost: () => {},
  isLoading: false,
  error: undefined,
});

/**
 * Profile provider to fetch and store profile data
 */
export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [postId, setPostId] = useState<string>("");
  const { data, error, isPending } = useGetPostById(postId);

  return (
    <PostContext.Provider
      value={{
        post: data?.post,
        fetchPost: setPostId,
        isLoading: isPending,
        error: error ?? undefined,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

/**
 * Custom hook to use the profile context
 */
export const usePost = (): PostViewContextType => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("useProfile must be used within a PostProvider");
  }
  return context;
};
