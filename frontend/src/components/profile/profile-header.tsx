import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/contexts/profile.context";
import { useMe } from "@/hooks/auth.hooks";
import { cn } from "@/lib/utils";
import { Copy, CopyCheck, UserPen, UserPlus } from "lucide-react";
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ClassNameValue } from "tailwind-merge";

const ProfilePicture = () => {
  const { profile } = useProfile();

  if (!profile) return <Skeleton className="w-20 h-20 rounded-full" />;

  return (
    <Avatar className="w-20 h-20 border-2 ">
      <AvatarImage src={profile.user.profile_picture_url} alt="Profile picture" />
      <AvatarFallback>{profile.user.username.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

function Bio() {
  const { profile } = useProfile();

  return profile ? (
    <p className="text-sm text-gray-600">{profile.user.bio}</p>
  ) : (
    <Skeleton className="w-56 h-6" />
  );
}

function Username() {
  const { profile } = useProfile();

  return profile ? (
    <h1 className="text-2xl font-bold">{profile.user.username}</h1>
  ) : (
    <Skeleton className="w-48 h-8" />
  );
}

const SocialMetrics = ({ className }: { className?: ClassNameValue }) => {
  const { profile } = useProfile();

  const MetricView = ({ value, name }: { value?: number; name: string }): ReactNode => {
    if (value === undefined) return <Skeleton className="w-8 h-10 " />;

    return (
      <div className="text-center flex flex-col gap-0.5 items-center flex-nowrap">
        <span className="text-gray-600"> posts</span>
        {value}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-row gap-4 ", className)}>
      <MetricView value={profile?.socialMetrics.posts} name="posts" />
      <MetricView value={profile?.socialMetrics.followers} name="followers" />
      <MetricView value={profile?.socialMetrics.following} name="following" />
    </div>
  );
};

const ShareProfileButton = () => {
  const [isShareLinkCopied, setIsShareLinkCopied] = useState(false);
  const { profile } = useProfile();

  const handleShareProfile = () => {
    if (profile)
      navigator.clipboard
        .writeText(new URL(`/profile/${profile.user.id}`, window.location.origin).toString())
        .then(() => {
          // TODO: possibly set false after x seconds
          setIsShareLinkCopied(true);
        })
        .catch((e) => toast.error("Failed to copy share link"));
  };

  return (
    <Button variant="outline" onClick={handleShareProfile}>
      {isShareLinkCopied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="ml-1">Share </span>
    </Button>
  );
};

const FollowProfileButton = () => {
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <Button variant={"outline"}>
      <UserPlus className="w-4 h-4" />
      <span className="ml-1">Follow</span>
    </Button>
  );
};

const ProfileButtons = () => {
  const { data: me } = useMe();
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <div className="flex gap-2">
      {
        // Only show edit profile button if the profile is the current user's profile
        profile.user.id === me?.user?.id && (
          <Link to="/profile/edit">
            <Button variant="outline">
              <UserPen className="w-4 h-4" />
              <span className="ml-1">Edit</span>
            </Button>
          </Link>
        )
      }
      {
        // Only show follow button if the profile is not the current user's profile
        !me?.user && me?.user?.id !== profile.user.id && <FollowProfileButton />
      }
      <ShareProfileButton />
    </div>
  );
};

export const ProfileHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 max-w-7xl mx-auto p-4 w-full">
      <div className="shrink-0 ">
        <ProfilePicture />
      </div>
      <div className="grow flex flex-col items-center md:block ">
        <div className="flex md:flex-row justify-between gap-4 flex-col items-center">
          <Username />
          <ProfileButtons />
        </div>
        <SocialMetrics className="mt-2" />
        <div className="mt-4 space-y-2 flex justify-center md:justify-start">
          <Bio />
        </div>
      </div>
    </div>
  );
};
