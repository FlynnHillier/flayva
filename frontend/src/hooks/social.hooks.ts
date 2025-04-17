import { api } from "@/api/api";
import { createConfigurableMutation } from "@/hooks/util/configurableMutation";
import { queryClient, setQueryData } from "@/lib/query";
import { queries } from "@/queries";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserById = (userId: string) => {
  return useQuery({
    ...queries.social.fetchUserById(userId),
    enabled: !!userId,
  });
};

export const useFetchProfilePreview = (userId: string) => {
  return useQuery({
    ...queries.social.fetchProfilePreview(userId),
    enabled: !!userId,
  });
};

export const useFollowUser = createConfigurableMutation(
  async ({ userId }: { userId: string }) => await api.social.followUser(userId),
  ["social", "follow"],
  {
    onSuccess: ({ success }, { userId }) => {
      if (success) {
        // Invalidate follow status query
        queryClient.invalidateQueries(
          queries.social.fetchOwnFollowingUserStatus(userId)
        );

        // Update profile preview query with new follower count
        setQueryData(
          queries.social.fetchProfilePreview(userId),
          (oldData) =>
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

queries.social.fetchUserById;

export const useUnfollowUser = createConfigurableMutation(
  async ({ userId }: { userId: string }) =>
    await api.social.unfollowUser(userId),
  ["social", "unfollow"],
  {
    onSuccess: ({ success }, { userId }) => {
      if (success) {
        // Invalidate follow status query
        queryClient.invalidateQueries(
          queries.social.fetchOwnFollowingUserStatus(userId)
        );

        // Update profile preview query with new follower count
        setQueryData(
          queries.social.fetchProfilePreview(userId),
          (oldData) =>
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
      queryClient.invalidateQueries(
        queries.social.fetchProfilePreview(data.user.id)
      );
      queryClient.invalidateQueries(queries.auth.me());
    },
  }
);
