import { api } from "@/api/api";
import { createConfigurableMutation } from "@/hooks/util/configurableMutation";
import { queryClient } from "@/lib/query";
import { queries } from "@/queries";
import { ProfilePreview } from "@flayva-monorepo/shared/types";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export const useFetchUserById = (userId: string) => {
  return useQuery({ ...queries.social.fetchUserById(userId), enabled: !!userId });
};

export const useFetchProfilePreview = (userId: string) => {
  return useQuery({ ...queries.social.fetchProfilePreview(userId), enabled: !!userId });
};

export const useFollowUser = createConfigurableMutation(
  async ({ userId }: { userId: string }) => await api.social.followUser(userId),
  ["social", "follow"],
  {
    onSuccess: ({ success }, { userId }) => {
      if (success) {
        // Invalidate follow status query
        queryClient.invalidateQueries(queries.social.fetchOwnFollowingUserStatus(userId));

        // Update profile preview query with new follower count
        queryClient.setQueryData(
          queries.social.fetchProfilePreview(userId).queryKey,
          (
            oldData:
              | Awaited<
                  ReturnType<
                    Awaited<ReturnType<typeof queries.social.fetchProfilePreview>>["queryFn"]
                  >
                >
              | undefined
          ) =>
            oldData && {
              ...oldData,
              profile: {
                ...oldData.profile,
                socialMetrics: {
                  ...oldData.profile.socialMetrics,
                  followers: oldData.profile.socialMetrics.followers + 1,
                },
              },
            }
        );
      }
    },
  }
);

export const useUnfollowUser = createConfigurableMutation(
  async ({ userId }: { userId: string }) => await api.social.unfollowUser(userId),
  ["social", "unfollow"],
  {
    onSuccess: ({ success }, { userId }) => {
      if (success) {
        // Invalidate follow status query
        queryClient.invalidateQueries(queries.social.fetchOwnFollowingUserStatus(userId));

        // Update profile preview query with new follower count
        queryClient.setQueryData(
          queries.social.fetchProfilePreview(userId).queryKey,
          (
            oldData:
              | Awaited<
                  ReturnType<
                    Awaited<ReturnType<typeof queries.social.fetchProfilePreview>>["queryFn"]
                  >
                >
              | undefined
          ) =>
            oldData && {
              ...oldData,
              profile: {
                ...oldData.profile,
                socialMetrics: {
                  ...oldData.profile.socialMetrics,
                  followers: oldData.profile.socialMetrics.followers - 1,
                },
              },
            }
        );
      }
    },
  }
);

export const useFetchOwnFollowingUserStatus = (userId: string) =>
  useQuery({
    ...queries.social.fetchOwnFollowingUserStatus(userId),
    enabled: !!userId,
  });

export const useUpdateProfile = createConfigurableMutation(
  api.social.updateProfile,
  ["social", "updateProfile"],
  {
    onSuccess(data) {
      queryClient.invalidateQueries(queries.social.fetchProfilePreview(data.user.id));
      queryClient.invalidateQueries(queries.auth.me());
    },
  }
);


export const useGetUserByUsername = (username: string, pageSize: number, pageNumber: number) => {
  return useQuery(queries.social.getUserByUsername(username, pageSize, pageNumber));
};

export const useInfiniteUserSearch = (username: string, initialPageSize: number, subsequentPageSize: number) => {
  return useInfiniteQuery({
    queryKey: ['infiniteUsers', username],
    queryFn: ({ pageParam = 1 }) => {
      const pageSize = pageParam === 1 ? initialPageSize : subsequentPageSize;
      return api.social.searchUserByUsername(username, pageSize, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const pagination = lastPage.data?.users?.pagination;
      if (!pagination) return undefined;
      
      return pagination.currentPage < pagination.totalPages 
        ? pagination.currentPage + 1 
        : undefined;
    },
    enabled: !!username,
  });
};