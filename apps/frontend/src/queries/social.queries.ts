import { createQueryKeys } from "@lukemorales/query-key-factory";

import { api } from "@/api/api";

export const social = createQueryKeys("social", {
  fetchUserById: (userId: string) => ({
    queryFn: () => api.social.fetchUserById(userId),
    queryKey: ["social", "userId", userId],
  }),
  fetchProfilePreview: (userId: string) => ({
    queryFn: () => api.social.fetchUserProfilePreview(userId),
    queryKey: ["social", "profilePreview", userId],
  }),
  fetchOwnFollowingUserStatus: (userId: string) => ({
    queryKey: ["social", "isfollowing", userId],
    queryFn: () => api.social.getOwnFollowingUserStatus(userId),
  }),
  getUserByUsername: (username: string, pageSize: number, pageNumber: number) => ({
    queryFn: () => api.social.getUserByUsername(username, pageSize, pageNumber),
    queryKey: ["social", "username", username],
  })
});
