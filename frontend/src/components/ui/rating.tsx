import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

type RatingIconProps = {
  fillPercentage: number;
  Icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  className?: string;
} & ComponentProps<"svg">;

const RatingIcon = ({
  fillPercentage,
  className,
  Icon = <Star />,
  ...props
}: RatingIconProps) => {
  const ref = useRef<SVGSVGElement>(null);
  const [strokeWidthAsPercentage, setStrokeWidthAsPercentage] =
    React.useState<number>(0);

  useEffect(() => {
    if (ref.current) {
      // TODO: an aspect of the way the internal width is being calculated here is not correct
      const strokeWidth =
        parseFloat(getComputedStyle(ref.current).strokeWidth) || 0;
      const rect = ref.current.getBoundingClientRect();
      const strokePercentage =
        rect.width > 0 ? (strokeWidth / rect.width) * 100 : 0;

      setStrokeWidthAsPercentage(strokePercentage);
    }
  }, [ref.current]);

  return (
    <div className={cn("relative inline-block group")}>
      {React.cloneElement(Icon, {
        className: cn(className, "fill-transparent"),
        ref,
        ...props,
        style: {
          ...props.style,
          vectorEffect: "non-scaling-stroke",
        },
      })}
      <div
        style={{
          position: "absolute",
          top: 0,
          overflow: "hidden",
          width: `calc(${strokeWidthAsPercentage}% + ${
            fillPercentage * (100 - 2 * strokeWidthAsPercentage)
          }%)`,
        }}
      >
        {React.cloneElement(Icon, {
          className: cn("fill-current", className),
          ...props,
          style: {
            ...props.style,
            vectorEffect: "non-scaling-stroke",
          },
        })}
      </div>
    </div>
  );
};

const PartialRatingIcon = RatingIcon;

const FullRatingIcon = ({
  ...props
}: Omit<RatingIconProps, "fillPercentage">) => (
  <RatingIcon fillPercentage={1} {...props} />
);

const EmptyRatingIcon = ({
  ...props
}: Omit<RatingIconProps, "fillPercentage">) => (
  <RatingIcon fillPercentage={0} {...props} />
);

/**
 * Rating component that displays a rating using icons.
 */
export const Rating = ({
  rating,
  interactive = false,
  onInteract,
  iconCount = 5,
  Icon = <Star />,
  className,
}: {
  rating: number;
  Icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  iconCount?: number;
  interactive?: boolean;
  onInteract?: (rating: number) => void;
  className?: string;
}) => {
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);

  const handleMouseEnterIcon = useCallback(
    (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      if (e.currentTarget.dataset.iconIndex)
        setHoveredRating(parseInt(e.currentTarget.dataset.iconIndex, 10));
    },
    [setHoveredRating]
  );

  const handleClickIcon = useCallback(
    (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      if (interactive && onInteract) {
        if (e.currentTarget.dataset.iconIndex)
          onInteract(parseInt(e.currentTarget.dataset.iconIndex, 10));
      }
    },
    [interactive, onInteract]
  );

  const displayedRating = useMemo(
    () =>
      interactive && hoveredRating !== null
        ? hoveredRating
        : Math.min(rating, iconCount),
    [hoveredRating, interactive, rating]
  );

  const stars = useMemo(
    () => ({
      full: Math.floor(displayedRating),
      partial: displayedRating % 1,
      empty: iconCount - Math.ceil(displayedRating),
    }),
    [displayedRating, iconCount]
  );

  return (
    <div
      className="max-w-fit flex flex-row flex-nowrap"
      onMouseLeave={() => setHoveredRating(null)}
    >
      {/* Render Full stars */}
      {Array.from({ length: stars.full }, (_, i) => (
        <FullRatingIcon
          className={cn(className, {
            "hover:cursor-pointer": interactive,
          })}
          onClick={handleClickIcon}
          onMouseEnter={handleMouseEnterIcon}
          data-icon-index={i + 1}
          Icon={Icon}
          key={i}
        />
      ))}
      {/* Render Partial star */}
      {stars.partial > 0 ? (
        <PartialRatingIcon
          fillPercentage={stars.partial}
          className={cn(className, { "hover:cursor-pointer": interactive })}
          onClick={handleClickIcon}
          onMouseEnter={handleMouseEnterIcon}
          data-icon-index={stars.full ? stars.full : 1}
          Icon={Icon}
        />
      ) : null}
      {/* Render empty stars */}
      {Array.from({ length: stars.empty }, (_, i) => (
        <EmptyRatingIcon
          className={className}
          onClick={handleClickIcon}
          onMouseEnter={handleMouseEnterIcon}
          data-icon-index={
            (stars.full ? stars.full : 0) + (stars.partial ? 1 : 0) + i + 1
          }
          Icon={Icon}
          key={i}
        />
      ))}
    </div>
  );
};
