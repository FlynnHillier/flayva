import RecipeMain from './RecipeMain';
import RecipeSidebar from './RecipeSidebar';

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
