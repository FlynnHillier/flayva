import { PostPreviewWithTags } from '../../../../backend/src/types/exported/post.types';
import { Link } from 'react-router-dom';
import PostPreviewTags from '../tags/PostPreviewTags';
import { uploadThingFileUrlFromKey } from '@/lib/ut';
import { useState, useEffect, useRef } from 'react';

interface PostPreviewProps {
	preview: PostPreviewWithTags;
	showUser?: boolean;
}

export default function PostPreview({
	preview,
	showUser = true,
}: PostPreviewProps) {
	const previewRef = useRef<HTMLAnchorElement>(null);
	const [previewWidth, setPreviewWidth] = useState(0);

	// Get the image URL
	const imagePreviewUrl = preview.images[0]?.key
		? uploadThingFileUrlFromKey(preview.images[0].key)
		: preview.images[0] || 'https://loremflickr.com/280/280?random=1';

	// Get the tags for the post
	const tags = preview.recipe.tagLinks || [];

	// Function to get the width of the post preview
	function getWidthPostPreview(): number {
		if (previewRef.current) {
			return previewRef.current.clientWidth;
		}
		return 0;
	}

	// Update width on mount and resize
	useEffect(() => {
		const updateWidth = () => {
			setPreviewWidth(getWidthPostPreview());
		};

		// Initial width calculation
		updateWidth();

		// Add resize listener
		window.addEventListener('resize', updateWidth);

		// Cleanup
		return () => window.removeEventListener('resize', updateWidth);
	}, []);

	return (
		<Link
			ref={previewRef}
			to={'/p/' + preview.id}
			className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md flex flex-col"
			style={{
				backgroundImage: `url(${imagePreviewUrl})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			{/* User info at top - only shown if showUser is true */}
			{showUser && (
				<div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent p-3">
					<img
						src={preview.owner.profile_picture_url}
						className="h-8 w-8 rounded-full object-cover"
						alt={`${preview.owner.username}'s profile`}
					/>
					<span className="text-sm font-medium text-white">
						{preview.owner.username}
					</span>
				</div>
			)}

			{/* Bottom content container with gradient background */}
			<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-3 px-3">
				{/* Recipe title first */}
				<div className="max-w-[85%] mb-2">
					<span className="text-sm lg:text-lg text-white font-semibold backdrop-blur-md">
						{preview.recipe.title}
					</span>
				</div>

				{/* Tags below the title */}
				<div>
					<PostPreviewTags tags={tags} containerWidth={previewWidth} />
				</div>
			</div>

			{/* Hover overlay */}
			<div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
		</Link>
	);
}

// Skeleton component for loading state
export function PostPreviewSkeleton({
	showUser = true,
}: {
	showUser?: boolean;
}) {
	return (
		<div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-sm bg-gray-200">
			{/* User info skeleton - only shown if showUser is true */}
			{showUser && (
				<div className="absolute inset-x-0 top-0 flex items-center gap-2 from-black/60 to-transparent p-3">
					<div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
					<div className="h-4 w-24 rounded-md bg-gray-300 animate-pulse"></div>
				</div>
			)}

			{/* Bottom content container */}
			<div className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-3">
				{/* Title skeleton */}
				<div className="mb-2">
					<div className="h-6 w-32 rounded-md bg-gray-300 animate-pulse"></div>
				</div>

				{/* Tags skeleton */}
				<div className="flex gap-1">
					<div className="h-4 w-16 rounded-full bg-gray-300 animate-pulse"></div>
					<div className="h-4 w-16 rounded-full bg-gray-300 animate-pulse"></div>
				</div>
			</div>
		</div>
	);
}
