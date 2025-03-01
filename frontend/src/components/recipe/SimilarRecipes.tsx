interface Recipe {
	image: string;
	url: string;
}

interface ImageGridProps {
	images: Recipe[];
}

function ImageGrid({ images }: ImageGridProps) {
	const imgGrid = images.map((recipe, index) => (
		<div key={index} className="w-full aspect-square">
			<img src={recipe.image} className="w-full h-full object-cover" />
		</div>
	));

	return (
		// Using grid-flow-col and auto-cols to ensure a single row
		// Each image cell maintains a width between 22% and 30% of the container
		<div className="grid grid-flow-col auto-cols-[minmax(22%,30%)] gap-2">
			{imgGrid}
		</div>
	);
}

interface SimilarRecipesProps {
	recommendedRecipes: Recipe[];
}
export default function SimilarRecipes(props: SimilarRecipesProps) {
	return (
		<div className="sticky bottom-0 h-auto min-h-40 bg-white w-full p-6 flex flex-col">
			<h2 className="text-2xl font-bold mb-2">Similar Recipes:</h2>
			<ImageGrid images={props.recommendedRecipes} />
		</div>
	);
}
