import { useFetchProfilePreview } from "@/hooks/social.hooks";
import { ProfilePreview } from "@flayva-monorepo/shared/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface ProfileContextType {
  profile?: ProfilePreview;
  fetchProfile: (profileId: string) => void;
  isLoading: boolean;
  error?: Error;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: undefined,
  fetchProfile: () => {},
  isLoading: false,
  error: undefined,
});

/**
 * Profile provider to fetch and store profile data
 */
export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileId, setProfileId] = useState<string>("");
  const { data, error, isPending } = useFetchProfilePreview(profileId);

  return (
    <ProfileContext.Provider
      value={{
        profile: data?.profile,
        fetchProfile: setProfileId,
        isLoading: isPending,
        error: error ?? undefined,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

/**
 * Custom hook to use the profile context
 */
export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
