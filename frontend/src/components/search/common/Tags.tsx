import { useState, useEffect } from 'react';
import Tag from '@/components/tags/Tag';
import { RecipeTag } from '@flayva-monorepo/shared/types';
import { RECIPE } from '@flayva-monorepo/shared/constants';

export default function Tags() {
	const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>(
		{}
	);
	const [lastFilters, setLastFilters] = useState<Record<string, string[]>>({});
	const [showApplyLastFilters, setShowApplyLastFilters] = useState(true);

	// Group tags by category
	const categorisedTags = RECIPE.RECIPE_TAGS.reduce((acc, tag) => {
		if (!acc[tag.category]) {
			acc[tag.category] = [];
		}
		acc[tag.category].push({
			id: `${tag.category}-${tag.name}`,
			tagName: tag.name,
			category: tag.category,
			emoji: tag.emoji,
		});
		return acc;
	}, {} as Record<string, RecipeTag[]>);

	// Toggle tag selection - allows multiple selections (OR logic)
	const toggleTag = (tag: RecipeTag) => {
		setSelectedTags((prev) => {
			const newSelectedTags = { ...prev };
			if (!newSelectedTags[tag.category]) {
				newSelectedTags[tag.category] = [];
			}

			if (newSelectedTags[tag.category].includes(tag.tagName)) {
				newSelectedTags[tag.category] = newSelectedTags[tag.category].filter(
					(t) => t !== tag.tagName
				);
			} else {
				newSelectedTags[tag.category].push(tag.tagName);
			}

			return newSelectedTags;
		});
	};

	// Apply last filters
	const applyLastFilters = () => {
		setSelectedTags(lastFilters);
		setShowApplyLastFilters(false);
	};

	// Apply current filters
	const applyFilters = () => {
		setLastFilters(selectedTags);
		// Here you would typically trigger a search with the selected filters
		console.log('Applying filters:', selectedTags);
	};

	// Check if a tag is selected
	const isTagSelected = (tag: RecipeTag) => {
		return selectedTags[tag.category]?.includes(tag.tagName) || false;
	};

	return (
		<div className="w-2/12 h-9/12 border-2 border-[#e5e5e5] rounded-md p-4 flex flex-col">
			<div className="text-center mb-2 text-gray-500 font-medium">Filters</div>

			{/* Apply Last Filters Button */}
			{showApplyLastFilters && Object.keys(lastFilters).length > 0 && (
				<button
					onClick={applyLastFilters}
					className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md text-center mb-4"
				>
					+ Apply Last Filters
				</button>
			)}

			{/* Filter Categories */}
			<div className="flex-grow overflow-auto space-y-4">
				{Object.entries(categorisedTags).map(([category, tags]) => (
					<div key={category} className="mb-4">
						<h3 className="text-sm text-gray-600 mb-2">{category}</h3>
						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => (
								<button
									key={tag.id}
									onClick={() => toggleTag(tag)}
									className={`flex items-center space-x-1 py-1 px-3 rounded-full text-sm ${
										isTagSelected(tag)
											? 'bg-blue-100 text-blue-700 border border-blue-300'
											: 'bg-gray-100 text-gray-700 border border-gray-200'
									}`}
								>
									<span>{tag.emoji}</span>
									<span>{tag.tagName}</span>
								</button>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Apply Button */}
			<button
				onClick={applyFilters}
				className="w-full py-3 bg-green-500 text-white rounded-md text-center font-medium mt-4"
			>
				Apply
			</button>
		</div>
	);
}
