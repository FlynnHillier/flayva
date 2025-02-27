import { useMe } from "@/hooks/auth.hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/Components/ui/card";
import ProfileHeader from "@/Components/ProfileHeader";
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
        <ProfileHeader />
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
