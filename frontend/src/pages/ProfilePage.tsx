import { Link } from "react-router-dom";
import { useMe } from "@/hooks/auth.hooks";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";

const ProfilePage = () => {
  const { data } = useMe();
  console.log(data);
  return (
    <div className="w-full p-4 bg-amber-50">
      <div className="flex flex-row items-center md:items-start gap-8 max-w-6xl mx-auto">
        <div className="flex-shrink-0">
          <Avatar className="sm:w-15 sm:h-15 md:h-20 md:w-20 lg:w-32 lg:h-32 border-4 border-white">
            <AvatarImage
              src={data?.user?.profile_picture_url}
              alt="Profile Picture"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 w-full">
          <div className="flex-row items-center flex gap-x-2 sm:gap-x-6 md:gap-x-18 lg:gap-x-37">
            <h1 className="font-bold xs:text-xs sm:text-sm md:text-base lg:text-xl">
              {data?.user?.username}
            </h1>
            <link rel="stylesheet" href="" />
            <Button variant="outline">Edit Profile</Button>
            <Button variant="outline">Share Profile</Button>
          </div>
          <div className="flex-row items-center flex gap-x-2 sm:gap-x-6 md:gap-x-18 lg:gap-x-44">
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
              <span className=" text-sm text-gray-600"> following</span>
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
    </div>
  );
};

export default ProfilePage;
