import { Rating } from "@/components/ui/rating";
import {
  useGetPostLikeStatus,
  useLikePost,
  useUnlikePost,
} from "@/hooks/post.hooks";
import { cn } from "@/lib/utils";
import { Heart, Star } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ClassNameValue } from "tailwind-merge";

/**
 * A base component for post interaction icons.
 * It takes an icon as a prop and applies some default styles to it.
 */
const PostInteractionIcon = ({
  icon,
}: {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}) =>
  React.cloneElement(icon, {
    className: cn("w-6 h-6 hover:cursor-pointer", icon.props.className),
  });

/**
 * A base component for post interaction buttons.
 * It takes an icon as a prop and applies some default styles to it.
 */
const PostInteractionButton = React.forwardRef<
  HTMLButtonElement,
  {
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  } & React.ComponentProps<"button">
>(({ icon, className, ...props }, ref) => (
  <button className={cn("w-fit h-fit block", className)} ref={ref} {...props}>
    {icon}
  </button>
));

/**
 *
 *
 *
 * LIKE / UNLIKE
 *
 *
 *
 */

/**
 * Post Like icon.
 */
const PostLikeIcon = ({ liked }: { liked: boolean }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Pulse animation when the post is liked
    if (liked) {
      setPulse(true);
      const timeout = setTimeout(() => {
        setPulse(false);
      }, 200);
      return () => {
        clearTimeout(timeout);
      };
    }

    if (!liked) {
      setPulse(false);
    }
  }, [liked]);

  // TODO: add a shine animation when the icon is hovered
  return (
    <PostInteractionIcon
      icon={
        <Heart
          className={cn(
            "relative group duration-200 transition-transform hover:cursor",
            {
              "fill-red-500 text-red-500": liked,
              // "text-muted": !liked,
              "scale-120": pulse,
            }
          )}
        />
      }
    />
  );
};

/**
 * Post Like button skeleton.
 * It is used to show a loading state while the like status is being fetched.
 */
const PostLikeButtonSkeleton = () => {
  return (
    <PostInteractionIcon
      icon={
        <Heart className="relative group animate-pulse hover:cursor-default" />
      }
    />
  );
};

//TODO: optimistic state updates
/**
 * Post Like button component.
 * It fetches the like status of the post and allows the user to like or unlike the post.
 */
export const PostLikeButton = ({ postId }: { postId: string | undefined }) => {
  if (!postId) return <PostLikeButtonSkeleton />;

  // Fetch the like status of the post
  const {
    data: statusData,
    error: statusError,
    isLoading: isStatusLoading,
  } = useGetPostLikeStatus(postId);

  // Like the post
  const {
    mutate: like,
    error: likeError,
    isPending: isLikePending,
  } = useLikePost(postId)();

  // Unlike the post
  const {
    mutate: unlike,
    error: unlikeError,
    isPending: isUnlikePending,
  } = useUnlikePost(postId)();

  useEffect(() => {
    if (statusError) toast.error("Failed to fetch like status");
  }, [statusError]);

  useEffect(() => {
    if (likeError) toast.error("Failed to like post");
  }, [likeError]);

  useEffect(() => {
    if (unlikeError) toast.error("Failed to unlike post");
  }, [unlikeError]);

  const handleClick = useCallback(() => {
    if (statusData?.liked) {
      unlike(undefined);
    } else {
      like(undefined);
    }
  }, [like, unlike, statusData]);

  if (isStatusLoading) return <PostLikeButtonSkeleton />;

  return (
    <PostInteractionButton
      onClick={handleClick}
      icon={
        <PostInteractionIcon
          icon={<PostLikeIcon liked={statusData?.liked ?? false} />}
        />
      }
      disabled={isStatusLoading || isLikePending || isUnlikePending}
    />
  );
};

/**
 *
 *
 *
 * RATING
 *
 *
 *
 */

const PostRatingSkeleton = ({ className }: { className?: ClassNameValue }) => (
  <Rating
    rating={5}
    interactive={false}
    className={cn(
      "animate-pulse fill-secondary text-primary/80 shrink-0",
      className
    )}
  />
);

export const PostRating = ({
  rating,
  interactive,
  onInteract,
}: {
  rating: number | undefined;
  interactive: boolean;
  onInteract?: (rating: number) => void;
}) => {
  if (rating === undefined) return <PostRatingSkeleton />;

  return (
    <Rating
      rating={rating}
      interactive={interactive}
      className={"fill-amber-300 stroke-[1.5] stroke-black"}
      onInteract={onInteract}
    />
  );
};

/**
 * A component to summarise the ratings of a post.
 */
export const PostRatingSummary = ({
  ratings,
  className,
}: {
  ratings:
    | {
        average: number;
        count: number;
      }
    | undefined;
  className?: ClassNameValue;
}) => (
  // TODO: improve skeletons
  <div
    className={cn("flex flex-row flex-nowrap items-center gap-x-1", className)}
  >
    <PostRating rating={ratings?.average} interactive={false} />

    <span className="font-semibold">{ratings?.count} Ratings</span>
  </div>
);

export const PostRatingInteractive = ({
  onSelect,
}: {
  onSelect: (rating: number) => void;
}) => <PostRating rating={0} interactive={true} onInteract={onSelect} />;
