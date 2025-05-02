import { useInfiniteScrollFeed } from "@/hooks/post.hooks";
import type { Post } from "@flayva/backend-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

type FeedContextType = {
  posts: Post[];
  activeIndex: number;
  isLoading: boolean;
  isPending: boolean;
  hasNextPage: boolean;
  error: Error | null;

  nextPost: () => void;
  prevPost: () => void;

  fetchMore: () => void;
  refresh: () => void;
};

const FeedContext = createContext<FeedContextType | null>(null);

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
};

export const FeedProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    data,
    isLoading,
    isPending,
    hasNextPage,
    error,
    fetchNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteScrollFeed();

  const fetchMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const posts = useMemo(
    () => data?.pages.flatMap((feedSection) => feedSection.feed) ?? [],
    [data]
  );

  const nextPost = useCallback(() => {
    setActiveIndex((prevIndex) =>
      Math.min(prevIndex + 1, hasNextPage ? posts.length : posts.length - 1)
    );
  }, [setActiveIndex, posts]);

  const prevPost = useCallback(() => {
    setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, [setActiveIndex]);

  useEffect(() => {
    // Fetch more posts if the active index is out of bounds and there are more posts to fetch
    if (activeIndex >= posts.length) {
      if (!isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    }
  }, [activeIndex, posts, isFetchingNextPage]);

  useEffect(() => {
    // Roll the active index back to the last post if the current active index is out of bounds AND there are no more posts to fetch
    if (isFetched && activeIndex >= posts.length && !hasNextPage) {
      setActiveIndex(posts.length - 1);
      toast.info("You have reached the end of the feed.");
    }
  }, [activeIndex, hasNextPage, posts]);

  return (
    <FeedContext.Provider
      value={{
        posts,
        isLoading,
        isPending,
        hasNextPage: hasNextPage || false,
        error,
        fetchMore,
        refresh: () => {},
        activeIndex,
        nextPost,
        prevPost,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
