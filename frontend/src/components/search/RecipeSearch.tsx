import { useProfile } from '@/contexts/profile.context';
import { useInfiniteScrollTitlePostPreviews } from '@/hooks/post.hooks';
import { uploadThingFileUrlFromKey } from '@/lib/ut';
import { type PostPreview } from '@flayva-monorepo/shared/types';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer';
import { FourSquare } from 'react-loading-indicators';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce.hooks';


const PostPreviewElement = ({ preview }: { preview: PostPreview }) => {
	const imagePreviewUrl = 'https://loremflickr.com/280/280?random=1';
	console.log({preview})
	return (
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
				
        <span className="text-md font-medium text-white">
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

export default function RecipeSearch({ input }: { input: string }) {
  const debouncedInput = useDebounce(input, 500);

	const {
		data,
		fetchNextPage,
		error,
		hasNextPage,
		isFetchingNextPage,
		isFetching,
		isFetched,
	} = useInfiniteScrollTitlePostPreviews(debouncedInput);

  console.log({hasNextPage})

	const previews = useMemo(
		() => (data ? data.pages.flatMap((page) => page.previews) : []),
		[data, data?.pages]

	);

	console.log(previews)

	const { ref, inView } = useInView();

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
		<div className="w-full max-w-7xl p-3 grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 xl:grid-cols-2  gap-5  place-items-center">
			{previews.map((preview) => (
				<PostPreviewElement key={preview.id} preview={preview[0]} />
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
				// If fetching, show a loading indicator
				(isFetchingNextPage || !isFetched) && (
					<div className="col-span-full text-center text-gray-500">
						<FourSquare color={'gray'} size={'small'} />
					</div>
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
