import { uploadThingFileUrlFromKey } from "@/lib/ut";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useFeed } from "./feed.context";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Post } from "../../../../backend/src/types/exported/post.types";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { FeedSidebar } from "./FeedSidebar";
import { PostRating } from "../post/ratings/ratings-common";

const ImageCarousel = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  return (
    <Carousel
      className={cn("w-full h-full overflow-hidden rounded-lg ", className)}
    >
      <CarouselContent className="h-full">
        {images.map((imageUrl, index) => (
          <CarouselItem key={index} className="w-full h-full overflow-hidden ">
            <img
              src={imageUrl}
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
}: {
  direction: "up" | "down";
  onClick?: () => void;
}) => {
  return (
    <div className="h-fit w-full flex flex-row justify-center items-center gap-2 py-1">
      <button
        className="hover:bg-muted rounded-full p-0.5 hover:cursor-pointer"
        onClick={onClick}
      >
        {direction === "up" && <ChevronUp />}
        {direction === "down" && <ChevronDown />}
      </button>
    </div>
  );
};

/**
 * A component that displays a single feed entry.
 */
const FeedEntry = React.forwardRef<HTMLDivElement, { post: Post }>(
  ({ post }, ref) => {
    return (
      <div
        className="h-full w-full relative @container rounded-xl overflow-hidden select-none"
        ref={ref}
      >
        <ImageCarousel
          images={post.images.map(({ key }) => uploadThingFileUrlFromKey(key))}
          className="grow-1"
        />
        <div className="flex flex-col @2xl:h-32 h-24 w-full absolute bottom-0 left-0 px-2 backdrop-blur-3xl">
          <div className="flex flex-row gap-2 items-center h-fit">
            <span className="@2xl:text-4xl text-2xl h-fit text-secondary rounded-xl font-semibold backdrop-blur-3xl w-fit ">
              {post.recipe.title}
            </span>
            {post.recipe.ratings.statiststics.count > 0 ? (
              <PostRating
                className="stroke-secondary"
                interactive={false}
                rating={post.recipe.ratings.statiststics.average}
              />
            ) : (
              <span className="text-sm text-secondary self-end"></span>
            )}
          </div>
          <span className="w-full text-secondary text-sm @2xl:text-lg font-normal ">
            {post.recipe.description}
          </span>
        </div>
      </div>
    );
  }
);

export const Feed = () => {
  const { posts, activeIndex, nextPost, prevPost } = useFeed();

  const feedContainerRef = useRef<HTMLDivElement>(null);
  const feedPostRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    const ref = feedPostRefs.current[activeIndex];
    ref?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeIndex, feedPostRefs.current]);

  return (
    <div className="flex flex-row flex-nowrap w-full max-h-full h-full  max-w-7xl">
      <div className="grow-1 max-h-full px-4 flex flex-col">
        <FeedNavigationHandle direction="up" onClick={prevPost} />
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
        </div>
        <FeedNavigationHandle direction="down" onClick={nextPost} />
      </div>
      <FeedSidebar
        post={posts[activeIndex]}
        className="shrink-0 h-full hidden xl:block w-72"
        isTransitioning={isFeedScrolling}
      />
    </div>
  );
};
