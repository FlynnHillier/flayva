import RecipeSidebar from "./RecipeSidebar";

function RecipeMain() {
  return <div></div>;
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
