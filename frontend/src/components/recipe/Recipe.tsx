import RecipeSidebar from "./RecipeSidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useMe } from "@/hooks/auth.hooks";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { Send } from "lucide-react";
import { ArrowBigRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import food1 from "@assets/test/food/food1.jpg";

function RecipeMain() {
  const { data } = useMe();
  return (
    <>
      <div className="w-full p-15" id="recipeMain">
        <Card>
          <CardContent className="relative">
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <ArrowBigRight className="w-6 h-6" />
            </div>
            {/* Image */}
            <img className="p-10 w-full" src={food1} alt="Food" />

            {/* Icons Container */}
            <div className="absolute bottom-12 left-18 flex space-x-2">
              <MessageCircle className="w-6 h-6" />
              <Heart className="w-6 h-6" />
              <Send className="w-6 h-6" />
            </div>
          </CardContent>
          <CardDescription className="relative">
            <div className="absolute bottom-8 left-6">
              <span className="font-bold pl-10 ">{data?.user?.username}</span> -
              Post Title
            </div>
            <div className="absolute bottom-0 left-16 flex space-x-2">
              <Badge className="rounded-full"> 🐔 Chicken </Badge>
              <Badge className="rounded-full"> 🌿 Vegan </Badge>
              <Badge className="rounded-full"> 🍕 Pizza </Badge>
            </div>
          </CardDescription>
        </Card>
      </div>
    </>
  );
}

export default function Recipe() {
  return (
    <>
      <div className="flex flex-row w-full h-screen">
        <RecipeMain />
        <RecipeSidebar />
      </div>
    </>
  );
}
