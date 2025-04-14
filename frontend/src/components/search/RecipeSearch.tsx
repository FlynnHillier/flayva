import { useInfiniteScrollTitleAndTagsPostPreviews } from '@/hooks/post.hooks';
import { type PostPreview } from '@flayva-monorepo/shared/types';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce.hooks';
import { Skeleton } from '../ui/skeleton';

// Component to display a preview of a recipe
const PostPreviewElement = ({ preview }: { preview: PostPreview }) => {
	// Either uses the first image of the recipe preview or a random image (more for testing purposes)
	const imagePreviewUrl =
		preview.images[0] || 'https://loremflickr.com/280/280?random=1';

	return (
		// Link to the full recipe/post
		<Link
			to={'/p/' + preview.id}
			className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md"
			style={{
				backgroundImage: `url(${imagePreviewUrl})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			{/* User info at top */}
			<div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent p-3">
				<span className="text-sm lg:text-lg text-white font-semibold backdrop-blur-xs p-1">
					{preview.recipe.title}
				</span>
			</div>

			{/* Recipe title at bottom */}
			<div className="absolute bottom-3 left-3 max-w-[85%] flex items-center gap-2">
				<img
					src={preview.owner.profile_picture_url}
					className="h-8 w-8 rounded-full object-cover"
					alt=""
				/>
				<div>
					<span className="text-sm font-medium text-white">
						{preview.owner.username}
					</span>
				</div>
			</div>

			{/* Hover overlay */}
			<div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
		</Link>
	);
};

// Skeleton component that mimics the PostPreviewElement
const PostPreviewSkeleton = () => {
	return (
		<div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-sm bg-gray-200">
			{/* Top title skeleton */}
			<div className="absolute inset-x-0 top-0 flex items-center gap-2  from-black/60 to-transparent p-3">
				<Skeleton className="h-6 w-32 rounded-md" />
			</div>

			{/* Bottom user info skeleton */}
			<div className="absolute bottom-3 left-3 max-w-[85%] flex items-center gap-2">
				<Skeleton className="h-8 w-8 rounded-full" />
				<Skeleton className="h-4 w-24 rounded-md" />
			</div>
		</div>
	);
};

// Main component
export default function RecipeSearchResults({
	input,
	selectedTags = {},
}: {
	input: string;
	selectedTags?: Record<string, string[]>;
}) {
	const debouncedInput = useDebounce(input, 500);
	const debouncedTags = useDebounce(selectedTags, 500);

	// Main hook call for infinite scrolling with title and tags
	const {
		data,
		fetchNextPage,
		error,
		hasNextPage,
		isFetchingNextPage,
		isFetching,
		isFetched,
	} = useInfiniteScrollTitleAndTagsPostPreviews(debouncedInput, debouncedTags);

	useEffect(() => {
		console.log({data})
	}, [data])


	const previews = useMemo(
		() => (data ? data.pages.flatMap((page) => page.previews) : []),
		[data, data?.pages]
	);

	const { ref, inView } = useInView();

	// Error message
	useEffect(() => {
		if (error)
			toast.error(
				error.message ?? 'Something went wrong while attempting to load posts'
			);
	}, [error]);

	useEffect(() => {
		if (inView && hasNextPage && !isFetching) fetchNextPage();
	}, [inView, hasNextPage, isFetching]);

	return (
		<div className="w-full max-w-7xl p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-5 place-items-center">
			{previews.map((preview) => (
				<PostPreviewElement key={preview.id} preview={preview} />
			))}
			{
				// If there are no posts and not fetching, show a message
				previews.length === 0 && !isFetching && !error && (
					<div className="col-span-full text-center text-gray-500">
						No posts available.
					</div>
				)
			}
			{
				// If fetching, show skeleton loading indicators
				(isFetchingNextPage || !isFetched) && (
					<>
						{Array.from({ length: 4 }).map((_, index) => (
							<PostPreviewSkeleton key={`skeleton-${index}`} />
						))}
					</>
				)
			}
			{error && (
				<div className="col-span-full text-center text-gray-500 flex flex-col items-center gap-2">
					<span className="text-red-500">Error loading posts</span>
					<Button
						variant="outline"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						Retry
					</Button>
				</div>
			)}

			<div ref={ref} className="w-full h-[1px]" />
		</div>
	);
}
