import { ProfileHeader } from "@/components/profile/profile-header";
import { Navigate, useParams } from "react-router-dom";

import { useEffect } from "react";
import { useProfile } from "@/contexts/profile.context";
import { NetworkResourceNotFoundError } from "@/lib/network";
import { ProfileContent } from "@/components/profile/profile-content";

const ViewProfilePage = () => {
  const { id } = useParams();
  const { fetchProfile, error } = useProfile();

  if (error instanceof NetworkResourceNotFoundError) {
    return <Navigate to="/profile/not-found" />;
  }

  useEffect(() => {
    if (id) fetchProfile(id);
  }, [id]);

  return (
    <>
      <ProfileHeader />
      <ProfileContent />
    </>
  );
};

export default ViewProfilePage;
