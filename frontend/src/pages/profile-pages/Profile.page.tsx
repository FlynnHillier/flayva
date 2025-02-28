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
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

import food1 from "@assets/test/food/food1.jpg";
import food2 from "@assets/test/food/food2.jpeg";
import food3 from "@assets/test/food/food3.jpg";
import food4 from "@assets/test/food/food4.jpeg";

import { useFetchUserById } from "@/hooks/social.hooks";

const images = [food1, food2, food3, food4, food1, food2, food3, food4];

const ProfilePage = () => {
  const { objectid } = useParams();
  const [profile, setProfile] = useState(null);

  //fetch profile hook
  //setProfile()

  //const { data } = useMe();
  //console.log(data);
  return (
    <div>
      <div className="w-full p-4 bg-white">
        <ProfileHeader objectId={objectid || "default"} />
      </div>
      <div className=" flex justify-center p-4">
        <Card className="relative sm:w-147 md:w-165 lg:w-149 xl:w-210">
          <CardContent>
            <div className="p-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
              {images.map((src, index) => (
                <Link to="/profile/detail">
                  <img key={index} src={src} alt={`Food ${index + 1}`} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
