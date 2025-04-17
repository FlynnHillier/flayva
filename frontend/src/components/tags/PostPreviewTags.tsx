import { RecipeTag } from "@flayva-monorepo/shared/types";
import Tag from "./Tag";
import { useEffect, useState } from "react";

interface PostPreviewTagsProps {
  tags: RecipeTag[];
  containerWidth?: number;
}

export default function PostPreviewTags({
  tags,
  containerWidth = 0,
}: PostPreviewTagsProps) {
  const [visibleTagCount, setVisibleTagCount] = useState(3); // Default to 3 tags

  // If no tags are available, show a message
  if (!tags || tags.length === 0) {
    return (
      <span className="text-xs bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur-sm">
        No tags
      </span>
    );
  }

  // Function to calculate how many tags can fit
  useEffect(() => {
    function calculateVisibleTags(): number {
      if (!containerWidth || containerWidth === 0) return 3; // Default

      // Approximate width calculations with overlap consideration
      const tagBaseWidth = 100; // Base width of a tag in pixels
      const tagScaleFactor = 0.75; // Scale factor from the CSS
      const tagOverlap = 12; // Pixels of overlap between tags
      const effectiveTagWidth = tagBaseWidth * tagScaleFactor - tagOverlap;
      const extraTagIndicatorWidth = 50; // Width of the "+X" indicator

      // Calculate how many tags can fit
      let availableWidth = containerWidth - 24; // Subtract padding (2 * 12px)

      // If we have more than the calculated number of tags, reserve space for the "+X" indicator
      if (tags.length > 3) {
        availableWidth -= extraTagIndicatorWidth;
      }

      // Calculate max number of tags that can fit
      const maxTags = Math.floor(availableWidth / effectiveTagWidth);

      // Limit to the actual number of tags available and ensure at least 1 tag
      return Math.max(1, Math.min(maxTags, tags.length));
    }

    setVisibleTagCount(calculateVisibleTags());
  }, [containerWidth, tags.length]);

  // Display the calculated number of tags, with a +x indicator for additional tags
  const displayTags = tags.slice(0, visibleTagCount);
  const extraTags =
    tags.length > visibleTagCount ? tags.length - visibleTagCount : 0;

  return (
    <div className="flex -space-x-3 items-center">
      {displayTags.map((tag, index) => (
        <div key={index} className="scale-75 origin-left">
          <Tag tag={tag} transparent={true} />
        </div>
      ))}
      {extraTags > 0 && (
        <span className="text-xs bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          +{extraTags}
        </span>
      )}
    </div>
  );
}
