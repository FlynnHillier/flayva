import { useMe } from "@/hooks/auth.hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Link } from "react-router-dom";
const images = [
  "/example-photos/food-4.jpeg",
  "/example-photos/food-2.jpeg",
  "/example-photos/food-3.jpg",
  "/example-photos/food-1.jpg",
  "/example-photos/food-1.jpg",
  "/example-photos/food-1.jpg",
  "/example-photos/food-1.jpg",
  "/example-photos/food-1.jpg",
  "/example-photos/food-1.jpg",
];
const ProfilePage = () => {
  const { data } = useMe();

  return (
    <div>
      <div className="w-full p-4 bg-white">
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
              <h1 className="text-2xl font-bold flex-1">
                {data?.user?.username}
              </h1>
              <div className="flex gap-2">
                <Link to="/profile/edit">
                  <Button variant="outline" className="flex-1 sm:flex-auto">
                    Edit Profile
                  </Button>
                </Link>

                <Button variant="outline" className="flex-1 sm:flex-auto">
                  Share Profile
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
