import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/profile-header";
import { Link, Navigate, useParams } from "react-router-dom";

import food1 from "@assets/test/food/food1.jpg";
import food2 from "@assets/test/food/food2.jpeg";
import food3 from "@assets/test/food/food3.jpg";
import food4 from "@assets/test/food/food4.jpeg";
import { useEffect } from "react";
import { useProfile } from "@/contexts/profile.context";
import { NetworkResourceNotFoundError } from "@/lib/network";

const images = [food1, food2, food3, food4, food1, food2, food3, food4];

const ViewProfilePage = () => {
  const { id } = useParams();
  const { fetchProfile, error } = useProfile();

  if (error instanceof NetworkResourceNotFoundError) {
    return <Navigate to="/profile/not-found" />;
  }

  useEffect(() => {
    console.log(id);
    if (id) fetchProfile(id);
  }, [id]);

  return (
    <div>
      <div className="w-full p-4">
        <ProfileHeader />
      </div>
      <div className=" flex justify-center p-4">
        <Card className="relative border-0 outline-0 ">
          <CardContent>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
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

export default ViewProfilePage;
