import Comments from "./Comments";
import SimilarRecipes from "./SimilarRecipes";
import RecipeSidebarHeader from "./RecipeBio";

// TODO: remove constants and replace with server data

const INGREDIENTS = [
  { ingredient: "Flour", amount: 2, unit: "cups" },
  { ingredient: "Chicken", amount: 2, unit: "Kg" },
  { ingredient: "Goon", amount: 2, unit: "goon" },
];

const COOKING_TIME = [
  { ingredient: "Prep Time", amount: 2, unit: "min" },
  { ingredient: "Cook time", amount: 2, unit: "hr" },
];

const COMMENTS = [
  {
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
    username: "John Doe",
    text: "This recipe is delicious! fh fh dif d ididdihjfh dididiihf",
  },
  {
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
    username: "John Doe",
    text: "This recipe is delicious! fh fh dif d ididdihjfh dididiihf",
  },
  {
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
    username: "John Doe",
    text: "This recipe is delicious! fh fh dif d ididdihjfh dididiihf",
  },
  {
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
    username: "John Doe",
    text: "This recipe is delicious! fh fh dif d ididdihjfh dididiihf",
  },
  {
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
    username: "John Doe",
    text: "This recipe is delicious! fh fh dif d ididdihjfh dididiihf",
  },
];

const RECOMMENDED_RECIPES = [
  {
    image:
      "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505",
    pageURL: "https://example.com/recipe1",
  },
  {
    image:
      "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505",
    pageURL: "https://example.com/recipe2",
  },
  {
    image:
      "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505",
    pageURL: "https://example.com/recipe3",
  },
];

const RECIPE_BIO = {
  profilePic:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
  username: "John Doe",
  rating: 2.5,
};

function RecipeIngredients({
  ingredients,
}: {
  ingredients: { ingredient: string; amount: number; unit: string }[];
}) {
  return (
    <ul>
      {ingredients.map((ingredient) => (
        <li className="flex flex-row">
          <div className="w-9/12 text-left text-gray-500">- {ingredient.ingredient}</div>
          <div className="w-3/12 text-gray-500">
            {ingredient.amount} {ingredient.unit}
          </div>
        </li>
      ))}
    </ul>
  );
}

function RecipeSection({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="w-full p-6 flex flex-col">
      <h2 className="text-large text-2xl font-bold">{heading}:</h2>
      <p className="text-gray-500">{body}</p>
    </div>
  );
}

export default function RecipeSidebar() {
  return (
    <div
      id="recipeSidebar"
      className="w-150 min-h-screen border-l-2 border-[#737373] overflow-y-auto"
    >
      <RecipeSidebarHeader {...RECIPE_BIO} />
      <RecipeSection
        heading="Description"
        body="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus aliquid voluptas libero numquam optio placeat aut, voluptate molestias hic nemo animi odit facilis esse distinctio, deleniti assumenda omnis explicabo aliquam."
      />
      <div className="w-full p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-2">Ingredients:</h2>
        <RecipeIngredients ingredients={INGREDIENTS} />
      </div>
      <RecipeSection
        heading="Recipe"
        body="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus aliquid voluptas libero numquam optio placeat aut, voluptate molestias hic nemo animi odit facilis esse distinctio, deleniti assumenda omnis explicabo aliquam."
      />
      <div className="w-full p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-2">Time:</h2>
        <RecipeIngredients ingredients={COOKING_TIME} />
      </div>
      <div className="w-full p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-2">Comments:</h2>
        <Comments comments={COMMENTS} />
      </div>
      <SimilarRecipes recipeInfo={RECOMMENDED_RECIPES} />
    </div>
  );
}
