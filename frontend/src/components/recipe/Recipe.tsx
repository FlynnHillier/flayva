import RecipeSidebar from './RecipeSidebar';

function RecipeMain() {
	return (
		<>
			<div className="w-full" id="recipeMain">
				<h1>RECIPE MAIN SECTION</h1>
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
