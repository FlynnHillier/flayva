import Recipe from "@/components/recipe/Recipe";
import food1 from "@assets/test/food/food1.jpg";
import food2 from "@assets/test/food/food2.jpeg";
import food3 from "@assets/test/food/food3.jpg";
import food4 from "@assets/test/food/food4.jpeg";

export default function FeedPage() {
  //list of recipies
  const posts = [{title: "chicken", photos: [food1, food2], tags: ["🐔 Chicken", "🌿 Vegan", "🍕 Pizza", "🐔 Chicken1", "🌿 Vegan2", "🍕 Pizza3"]},{title: "pizza", photos: [food3, food4], tags: ["🐔 Orange", "🌿 Vegiatrain", "🍕 Pizza"]}]
  console.log(posts)
  return (
    <div className="relative">
      <Recipe posts={posts}/>
    </div>
  )}
