import TagsSelector from "@/components/tags/TagsSelector";

interface TagsProps {
  visible: boolean;
  selectedTagIds: number[];
  setSelectedTagIds: React.Dispatch<React.SetStateAction<number[]>>;
  isMobile?: boolean;
}

export default function Tags({
  visible = true,
  selectedTagIds,
  setSelectedTagIds,
  isMobile = false,
}: TagsProps) {
  // Use CSS classes to control visibility and width for desktop view
  const containerClasses = isMobile
    ? "w-full h-full overflow-y-auto"
    : `${
        visible
          ? "w-2/12 opacity-100"
          : "w-0 opacity-0 p-0 border-0 overflow-hidden"
      } max-h-[calc(100vh-120px)] border-2 border-[#e5e5e5] rounded-md p-4 flex flex-col transition-all duration-300`;

  return (
    <div className={containerClasses}>
      {!isMobile && (
        <div className="text-center mb-2 text-gray-500 font-medium">
          Filters
        </div>
      )}

      {/* Filter Categories */}
      <div className={isMobile ? "h-full" : "flex-grow overflow-auto"}>
        <TagsSelector
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
          compact={isMobile}
        />
      </div>
    </div>
  );
}
