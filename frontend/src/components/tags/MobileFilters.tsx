import { X } from "lucide-react";
import Tags from "@/components/search/common/Tags";

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTagIds: number[];
  setSelectedTagIds: React.Dispatch<React.SetStateAction<number[]>>;
}

// Mobile filters component
export default function MobileFilters({
  isOpen,
  onClose,
  selectedTagIds,
  setSelectedTagIds,
}: MobileFiltersProps) {
  // Don't render anything if the filter is not open
  if (!isOpen) return null;

  return (
    // Full-screen fixed overlay with high z-index to appear above other content
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-medium">Filters</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Close filters"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main content area with scrollable filter options */}
      <div className="flex-1 overflow-auto p-4">
        <Tags
          visible={true}
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
          isMobile={true} // Pass isMobile flag to adapt the Tags component for mobile view
        />
      </div>
    </div>
  );
}
