import { useMe } from "@/hooks/auth.hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Link, useLocation, useParams } from "react-router-dom";
import { useState } from "react";

import food1 from "@assets/test/food/food1.jpg";
import food2 from "@assets/test/food/food2.jpeg";
import food3 from "@assets/test/food/food3.jpg";
import food4 from "@assets/test/food/food4.jpeg";
import EditProfile from "@/components/EditProfileForm";
const images = [food1, food2, food3, food4, food1, food2, food3, food4];

const ProfilePage = () => {
  const { objectid } = useParams();
  const [editingProfile, setEditingProfile] = useState(false);

  const handleEditToggle = () => {
    setEditingProfile((prev) => !prev);
  };

  return (
    <div className="relative">
      <div className="w-full p-4 bg-white">
        <ProfileHeader
          objectId={objectid || "default"}
          onEditToggle={handleEditToggle}
          editingProfile={editingProfile}
        />
      </div>

      <div
        className={`flex justify-center p-4 ${editingProfile ? "blur-sm" : ""}`}
      >
        <div className="w-full max-w-screen-2xl">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-2">
            {images.map((src, index) => (
              <Link key={index} to="/profile/detail" className="block w-full">
                <img
                  key={index}
                  src={src}
                  alt={`Food ${index + 1}`}
                  className="w-full h-auto aspect-square object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {editingProfile && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="flex items-center justify-center h-full">
            <EditProfile handleClose={handleEditToggle} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
