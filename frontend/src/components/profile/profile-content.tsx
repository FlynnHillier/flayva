import food1 from "@assets/test/food/food1.jpg";
import { Link } from "react-router-dom";

const PostPreview = () => {
  return (
    <Link to="/p/test-123">
      <div className="rounded-sm overflow-hidden w-full max-w-fit aspect-square ">
        <img src={food1} className="object-cover" />
      </div>
    </Link>
  );
};

export const ProfileContent = () => {
  return (
    <div className="w-full max-w-7xl p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-3  place-items-center">
      {new Array(10).fill(0).map((src, index) => (
        <PostPreview key={index} />
      ))}
    </div>
  );
};
