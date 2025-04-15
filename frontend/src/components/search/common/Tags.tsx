import TagsSelector from '@/components/tags/TagsSelector';

interface TagsProps {
	visible: boolean;
	selectedTags: Record<string, string[]>;
	setSelectedTags: React.Dispatch<
		React.SetStateAction<Record<string, string[]>>
	>;
	isMobile?: boolean;
}

export default function Tags({
	visible = true,
	selectedTags,
	setSelectedTags,
	isMobile = false
}: TagsProps) {

  // Use CSS classes to control visibility and width for desktop view
	const containerClasses = isMobile 
		? "w-full h-full overflow-y-auto" 
		: `${
				visible
					? 'w-2/12 opacity-100'
					: 'w-0 opacity-0 p-0 border-0 overflow-hidden'
			} max-h-[calc(100vh-120px)] border-2 border-[#e5e5e5] rounded-md p-4 flex flex-col transition-all duration-300`;

	return (
		<div className={containerClasses}>
			{!isMobile && <div className="text-center mb-2 text-gray-500 font-medium">Filters</div>}

			{/* Filter Categories */}
			<div className={isMobile ? "h-full" : "flex-grow overflow-auto"}>
				<TagsSelector
					selectedTags={selectedTags}
					setSelectedTags={setSelectedTags}
					compact={isMobile}
				/>
			</div>
		</div>
	);
}
