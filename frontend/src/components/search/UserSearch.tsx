import { useEffect, useState } from 'react';
import { User } from '@flayva-monorepo/shared/types';
import { useInfiniteUserSearch } from '@/hooks/social.hooks';
import { useDebounce } from '@/hooks/useDebounce.hooks';
import { useInView } from 'react-intersection-observer';

export default function UserSearch({ input }: { input: string }) {
  const initialPageSize = 20;
  const subsequentPageSize = 6;
  const debouncedInput = useDebounce(input, 500);
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteUserSearch(debouncedInput, initialPageSize, subsequentPageSize);

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

  const users: User[] = data?.pages.flatMap(page => page.data?.users?.users || []) || [];

  return (
    <div id="scrollableDiv" className="h-full overflow-auto">
      {users.map((user: User) => (
        <div key={user.id} className="flex items-center gap-3 p-2">
          <img
            src={user.profile_picture_url}
            className="w-10 h-10 rounded-full"
          />
          <h2 className="font-bold">{user.username}</h2>
        </div>
      ))}
      
      {(isLoading || isFetchingNextPage) && <p>Loading...</p>}
      
      {!hasNextPage && users.length > 0 && <p>No more users found.</p>}
      
      <div ref={ref} style={{ height: '20px' }}></div>
    </div>
  );
}
