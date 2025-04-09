import { useEffect, useState } from 'react';
import { User } from '@flayva-monorepo/shared/types';
import { useInfiniteUserSearch } from '@/hooks/social.hooks';
import { useDebounce } from '@/hooks/useDebounce.hooks';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '../ui/skeleton';
import { Link } from 'react-router-dom';

export default function UserSearch({ input }: { input: string }) {
	const INITIAL_PAGE_SIZE = 20;
	const SUBSEQUENT_PAGE_SIZE = 6;
	const debouncedInput = useDebounce(input, 500);
	const { ref, inView } = useInView();

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		refetch,
	} = useInfiniteUserSearch(
		debouncedInput,
		INITIAL_PAGE_SIZE,
		SUBSEQUENT_PAGE_SIZE
	);

	useEffect(() => {
		if (debouncedInput) {
			refetch();
		}
	}, [debouncedInput, refetch]);

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

	const users: User[] =
		data?.pages.flatMap((page) => page.data?.users?.users || []) || [];

	return (
		<div id="scrollableDiv" className="h-full overflow-auto">
			{users.map((user: User) => (
				<Link to={'/profile/' + user.id} className='w-full'>
					<div key={user.id} className="flex items-center gap-3 p-2">
						<img
							src={user.profile_picture_url}
							className="w-10 h-10 rounded-full"
						/>
						<h2 className="font-semibold">{user.username}</h2>
					</div>
				</Link>
			))}

			{(isLoading || isFetchingNextPage) && (
				<div className="flex flex-col gap-3 items-center mt-[20%]">
					<Skeleton className="w-[65%] h-[20px] rounded-full mb-2" />
					<Skeleton className="w-[65%] h-[20px] rounded-full mb-2" />
					<Skeleton className="w-[65%] h-[20px] rounded-full mb-2" />
					<Skeleton className="w-[65%] h-[20px] rounded-full mb-2" />
					<Skeleton className="w-[65%] h-[20px] rounded-full mb-2" />
					<Skeleton className="w-[65%] h-[20px] rounded-full mb-2" />
					<Skeleton className="w-[65%] h-[20px] rounded-full mb-2" />
					<Skeleton className="w-[65%] h-[20px] rounded-full mb-2" />
					<Skeleton className="w-[65%] h-[20px] rounded-full mb-2" />
					<Skeleton className="w-[65%] h-[20px] rounded-full mb-2" />
					<Skeleton className="w-[65%] h-[20px] rounded-full" />
{/* TODO: change */}
				</div>
			)}

			{!hasNextPage && users.length > 0 && (
				<div className="w-full flex items-center justify-center">
					<p>No more users found</p>
				</div>
			)}

			<div ref={ref} style={{ height: '20px' }}></div>
		</div>
	);
}
