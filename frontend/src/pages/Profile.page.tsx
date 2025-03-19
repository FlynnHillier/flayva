import { ProfileHeader } from "@/components/ProfileHeader";
import { Link, useParams } from "react-router-dom";
import { useQueryState } from "nuqs";
import food1 from "@assets/test/food/food1.jpg";
import food2 from "@assets/test/food/food2.jpeg";
import food3 from "@assets/test/food/food3.jpg";
import food4 from "@assets/test/food/food4.jpeg";
import EditProfile from "@/components/EditProfileForm";
import { cn } from "@/lib/utils";
const images = [food1, food2, food3, food4, food1, food2, food3, food4];

const ProfilePage = () => {
  const { objectid } = useParams();

  const [isEditing, setEditQuery] = useQueryState("edit", {
    parse: (value) => value === "true",
    defaultValue: false,
    shallow: false,
  });

  return (
    <div className="relative">
      <div className="w-full p-4 bg-white">
        <ProfileHeader
          objectId={objectid || "default"}
          onEditToggle={() => setEditQuery(true)}
          editingProfile={isEditing}
        />
      </div>

      <div className={cn("flex justify-center p-4", { "blur-sm": isEditing })}>
        <div className="w-full max-w-screen-2xl">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-2">
            {images.map((src, index) => (
              <Link key={index} to="/recipe" className="block w-full">
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

      {isEditing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="flex items-center justify-center h-full">
            <EditProfile handleClose={() => setEditQuery(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
