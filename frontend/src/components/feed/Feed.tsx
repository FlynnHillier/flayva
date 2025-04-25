import { uploadThingFileUrlFromKey } from "@/lib/ut";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { useFeed } from "./feed.context";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Post } from "../../../../backend/src/types/exported/post.types";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { FeedSidebar } from "./FeedSidebar";
import { PostRating } from "../post/ratings/ratings-common";
import { Skeleton } from "../ui/skeleton";
import { ProfilePicture } from "../profile/profile-common";
import { Link } from "react-router-dom";

const ImageCarousel = ({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) => {
  const { posts, activeIndex } = useFeed();

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    // This effect is used to handle keyboard navigation for the carousel.
    // It listens for keydown events and scrolls the carousel accordingly.
    // It also checks if the currently active post is the same as the one being viewed.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (posts[activeIndex] && posts[activeIndex].id === post.id)
        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            api.scrollPrev();
            break;
          case "ArrowRight":
            event.preventDefault();
            api.scrollNext();
            break;
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [api, posts, activeIndex]);

  return (
    <Carousel
      setApi={setApi}
      className={cn("w-full h-full overflow-hidden rounded-lg ", className)}
    >
      <CarouselContent className="h-full">
        {post.images.map(({ key }, index) => (
          <CarouselItem key={index} className="w-full h-full overflow-hidden ">
            <img
              loading="lazy"
              src={uploadThingFileUrlFromKey(key)}
              alt={`Image ${index + 1}`}
              className="object-cover w-full h-full rounded-lg"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const FeedNavigationHandle = ({
  direction,
  onClick,
  disabled,
}: {
  direction: "up" | "down";
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <div className="h-fit w-full flex flex-row justify-center items-center gap-2 py-1">
      <button
        disabled={disabled}
        className={cn("rounded-full p-0.5 ", {
          "text-muted-foreground": disabled,
          "hover:bg-muted hover:cursor-pointer": !disabled,
        })}
        onClick={onClick}
      >
        {direction === "up" && <ChevronUp />}
        {direction === "down" && <ChevronDown />}
      </button>
    </div>
  );
};

const FeedEntryFooter = ({ post }: { post: Post }) => (
  <div className="flex flex-col h-fit @2xl:max-h-40 max-h-40 py-2 w-full absolute bottom-0 left-0 px-2 backdrop-blur-3xl bg-black/50">
    <Link
      className="flex flex-row gap-2 items-center h-fit w-fit pr-2 shrink-0"
      to={`/profile/${post.owner.id}`}
    >
      {/* User */}
      <ProfilePicture user={post.owner} className="size-10" />
      <div className="flex flex-col gap-0">
        <span className="text-secondary text-sm @2xl:text-lg font-semibold">
          {post.owner.username}
        </span>
        {/* Date */}
        <span className="text-secondary text-xs font-normal">
          {new Date(post.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </Link>
    <div className="flex flex-row gap-2 items-center h-fit shrink-0 flex-nowrap text-nowrap">
      {/* Title */}
      <Link
        className="@2xl:text-4xl @2xl:pb-1 text-2xl h-fit text-secondary rounded-xl font-semibold  max-w-fit truncate flex flex-row flex-nowrap items-center @2xl:gap-2 gap-1"
        to={`/p/${post.id}`}
      >
        <span className="grow">{post.recipe.title}</span>
        <ExternalLink className="@2xl:size-6 size-4 mt-1" />
      </Link>
      {/* Rating */}
      {post.recipe.ratings.statiststics.count > 0 && (
        <PostRating
          className="stroke-secondary @2xl:mt-2 @2xl:size-6 size-5 mt-1 shrink-0"
          interactive={false}
          rating={post.recipe.ratings.statiststics.average}
        />
      )}
    </div>
    {/* Description */}
    <span className="w-full text-secondary text-sm @2xl:text-lg font-normal grow-1">
      {/* TODO: add text truncate here */}
      {post.recipe.description}
    </span>
  </div>
);

/**
 * A component that displays a single feed entry.
 */
const FeedEntry = React.forwardRef<HTMLDivElement, { post: Post }>(
  ({ post }, ref) => {
    return (
      <div
        className="h-full w-full relative @container rounded-xl overflow-hidden select-none mb-2"
        ref={ref}
      >
        <ImageCarousel post={post} className="grow-1" />
        <FeedEntryFooter post={post} />
      </div>
    );
  }
);

export const Feed = () => {
  const { posts, activeIndex, nextPost, prevPost, hasNextPage } = useFeed();

  const feedContainerRef = useRef<HTMLDivElement>(null);

  const feedPostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const feedPostSkeletonRef = useRef<HTMLDivElement>(null);

  const [isFeedScrolling, setIsFeedScrolling] = useState(false);

  /**
   * This effect is used to handle keyboard navigation for the feed.
   */
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const keyDownHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          prevPost();
          break;
        case "ArrowDown":
          event.preventDefault();
          nextPost();
          break;
      }
    };

    window.addEventListener("keydown", keyDownHandler, {
      signal,
    });

    return () => {
      controller.abort();
    };
  }, [prevPost, nextPost, feedPostRefs]);

  /**
   * This effect is used to track scrolling in the feed container.
   */
  useEffect(() => {
    if (!feedContainerRef.current) return;

    const controller = new AbortController();
    const { signal } = controller;

    feedContainerRef.current.addEventListener(
      "scroll",
      () => setIsFeedScrolling(true),
      { signal }
    );

    feedContainerRef.current.addEventListener(
      "scrollend",
      () => setIsFeedScrolling(false),
      { signal }
    );

    return () => {
      controller.abort();
    };
  }, [feedContainerRef.current]);

  /**
   * This effect is used to scroll the active post into view when the active index changes.
   */
  useEffect(() => {
    if (activeIndex >= posts.length)
      feedPostSkeletonRef.current?.scrollIntoView({ behavior: "smooth" });
    else {
      const ref = feedPostRefs.current[activeIndex];
      ref?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex, feedPostRefs.current, feedPostSkeletonRef.current, posts]);

  /**
   * This effect is used to instantly scroll to the active post when the feed is first loaded.
   * It ensures that the active post is always in view when the feed is rendered.
   */
  useEffect(() => {
    if (activeIndex >= posts.length)
      feedPostSkeletonRef.current?.scrollIntoView({ behavior: "instant" });
    else {
      const ref = feedPostRefs.current[activeIndex];
      ref?.scrollIntoView({
        behavior: "instant",
        block: "nearest",
      });
    }
    setIsFeedScrolling(false);
  }, [feedPostRefs.current, feedPostSkeletonRef.current]);

  return (
    <div className="flex flex-row flex-nowrap w-full max-h-full h-full  max-w-7xl">
      <div className="grow-1 max-h-full px-4 flex flex-col">
        <FeedNavigationHandle
          direction="up"
          onClick={prevPost}
          disabled={activeIndex === 0}
        />
        <div
          className="grow-1  rounded-lg overflow-hidden "
          ref={feedContainerRef}
        >
          {posts.map((post, i) => (
            <FeedEntry
              key={post.id}
              post={post}
              ref={(el) => {
                if (el) feedPostRefs.current[i] = el;
              }}
            />
          ))}
          {/* Skeleton loading post view */}
          <div className="h-full w-full" ref={feedPostSkeletonRef}>
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </div>
        <FeedNavigationHandle
          direction="down"
          onClick={nextPost}
          disabled={
            hasNextPage
              ? activeIndex >= posts.length
              : activeIndex >= posts.length - 1
          }
        />
      </div>
      <FeedSidebar
        post={posts[activeIndex]}
        className="shrink-0 h-full hidden xl:block w-72"
        isTransitioning={isFeedScrolling}
      />
    </div>
  );
};
