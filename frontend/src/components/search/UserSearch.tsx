import { useEffect, useState } from 'react';
import { User } from '@flayva-monorepo/shared/types';
import { useInfiniteUserSearch } from '@/hooks/social.hooks';
import { useDebounce } from '@/hooks/useDebounce.hooks';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '../ui/skeleton';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function UserSearchResults({ input }: { input: string }) {
	// Constant values for fetching data
	const INITIAL_PAGE_SIZE = 20;
	const SUBSEQUENT_PAGE_SIZE = 6;
	const debouncedInput = useDebounce(input, 500); // Debounce function so less requests
	const { ref, inView } = useInView();

	// Main hook call to retreive data
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		refetch,
		error,
	} = useInfiniteUserSearch(
		debouncedInput,
		INITIAL_PAGE_SIZE,
		SUBSEQUENT_PAGE_SIZE
	);

	// Displays an error message if error
	useEffect(() => {
		if (error)
			toast.error(
				error.message ?? 'Something went wrong while attempting to load users'
			);
	}, [error]);

	// If input changes, fetch new data based on new input
	useEffect(() => {
		if (debouncedInput) {
			refetch();
		}
	}, [debouncedInput, refetch]);

	// Fetch new page based on effect changes
	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

	// Maps users to array due to formatting
	const users: User[] =
		data?.pages.flatMap((page) => page.data?.users?.users || []) || [];

	// Main component
	return (
		<div id="scrollableDiv" className="h-full overflow-auto">
			{/* Each user as a mini component */}
			{users.map((user: User) => (
				<Link to={'/profile/' + user.id} className="w-full">
					<div key={user.id} className="flex items-center gap-3 p-2">
						<img
							src={user.profile_picture_url}
							className="w-10 h-10 rounded-full"
						/>
						<h2 className="font-semibold">{user.username}</h2>
					</div>
				</Link>
			))}

			{/* If loading new data, displays a skeleton of a user */}
			{(isLoading || isFetchingNextPage) && (
				<div className="flex flex-col gap-3 items-center mt-5">
					{Array.from({ length: 8 }).map((_, index) => (
						<Skeleton key={index} className="w-5/12 h-5 rounded-full mb-2" />
					))}
				</div>
			)}

			{/* Referene div to track screen scrolling for infinite scrolling */}
			<div ref={ref} style={{ height: '20px' }}></div>
		</div>
	);
}
