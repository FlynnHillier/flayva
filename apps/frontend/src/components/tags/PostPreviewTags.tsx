import type { RecipeTag } from "@flayva/types";
import Tag from "./Tag";
import { useEffect, useRef, useState } from "react";

interface PostPreviewTagsProps {
  tags: RecipeTag[];
  containerWidth?: number;
}

export default function PostPreviewTags({
  tags,
  containerWidth = 0,
}: PostPreviewTagsProps) {
  const [visibleTagCount, setVisibleTagCount] = useState(3);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // On mount or when tags/containerWidth change, measure and update
  useEffect(() => {
    if (!containerRef.current || tags.length === 0) return;

    // Get available width
    const availableWidth = containerWidth
      ? containerWidth - 24 // 24px for padding (12px on each side)
      : containerRef.current.offsetWidth - 24;

    // Measure tag widths
    let usedWidth = 0;
    let fitCount = 0;
    for (let i = 0; i < tags.length; i++) {
      const tagEl = tagRefs.current[i];
      if (!tagEl) continue;
      // Add margin-right px except after last tag
      const tagWidth = tagEl.offsetWidth + (i < tags.length - 1 ? 12 : 0);
      if (usedWidth + tagWidth > availableWidth) break;
      usedWidth += tagWidth;
      fitCount++;
    }

    // If not all tags fit, reserve space for the "+X" indicator
    if (fitCount < tags.length) {
      // Estimate "+X" indicator width
      const indicatorWidth = 50;
      while (fitCount > 0 && usedWidth + indicatorWidth > availableWidth) {
        fitCount--;
        usedWidth -= tagRefs.current[fitCount]?.offsetWidth ?? 0;
        if (fitCount > 0) usedWidth -= 12;
      }
    }

    setVisibleTagCount(Math.max(1, fitCount));
  }, [tags, containerWidth]);

  // Render hidden tags for measurement
  return (
    <div ref={containerRef} className="flex space-x-3 items-center relative">
      {/* Hidden tags for measuring */}
      <div className="absolute pointer-events-none opacity-0 h-0 overflow-hidden">
        {tags.map((tag, i) => (
          <div
            key={i}
            ref={(el) => {
              tagRefs.current[i] = el;
            }}
            className="inline-block"
          >
            <Tag tag={tag} transparent={true} className="@xl:text-lg" />
          </div>
        ))}
      </div>
      {/* Visible tags */}
      {tags.slice(0, visibleTagCount).map((tag, i) => (
        <div key={i} className="origin-left">
          <Tag tag={tag} transparent={true} className="@xl:text-lg" />
        </div>
      ))}
      {tags.length > visibleTagCount && (
        <span className="text-xs bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          +{tags.length - visibleTagCount}
        </span>
      )}
    </div>
  );
}
