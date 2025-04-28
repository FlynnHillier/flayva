export default function SimilarRecipes({
  recipeInfo,
}: {
  recipeInfo: { image: string; pageURL: string }[];
}) {
  return (
    <div className="sticky bottom-0 h-auto bg-white w-full p-3 flex flex-col">
      <h2 className="text-2xl ml-2 font-bold mb-2">Similar Recipes:</h2>
      <div className="grid grid-flow-col gap-2">
        {recipeInfo.map((recipe) => (
          <a href={recipe.pageURL}>
            <div key={recipe.pageURL} className="w-full aspect-square">
              <img src={recipe.image} className="w-full h-full object-cover rounded-lg" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
