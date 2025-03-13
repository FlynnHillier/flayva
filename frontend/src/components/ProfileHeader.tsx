import React from "react";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useMe } from "@/hooks/auth.hooks";
import { Link } from "react-router-dom";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

link: "http://localhost:5173/profile";

const ProfileHeader = () => {
  const { data } = useMe();
  const [isCopied, setIsCopied] = useState(false);
  const link = "http://localhost:5173/profile";

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Could not copy link:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 max-w-6xl mx-auto">
      <div className="flex-shrink-0">
        <Avatar className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 border-4 border-white">
          <AvatarImage
            src={data?.user?.profile_picture_url}
            alt="option here for alt"
          />
          <AvatarFallback>{data?.user?.username.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <h1 className="text-2xl font-bold flex-1">{data?.user?.username}</h1>
          <div className="flex gap-2">
            <Link to="/profile/edit">
              <Button variant="outline" className="flex-1 sm:flex-auto">
                Edit Profile
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={handleShareProfile}
              className="flex-1 sm:flex-auto"
            >
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" /> Share Profile
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <span className="font-bold">150</span>
            <span className="text-gray-600"> posts</span>
          </div>
          <div className="text-center">
            <span className="font-bold">10k</span>
            <span className="text-gray-600"> followers</span>
          </div>
          <div className="text-center">
            <span className="font-bold">500</span>
            <span className="text-gray-600"> following</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">{data?.user?.bio}</p>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
            www.gooners.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
