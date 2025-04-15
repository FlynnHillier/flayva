import { useInfiniteScrollTitleAndTagsPostPreviews } from '@/hooks/post.hooks';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce.hooks';
import PostPreview from '../post/PostPreview';
import { PostPreviewSkeleton } from '../post/PostPreview';

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
		<div className="w-full max-w-7xl p-3 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 place-items-center">
			{previews.map((preview) => (
				<PostPreview key={preview.id} preview={preview} showUser={true} />
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
						{Array.from({ length: 6 }).map((_, index) => (
							<PostPreviewSkeleton key={`skeleton-${index}`} showUser={true} />
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
