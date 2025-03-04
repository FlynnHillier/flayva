function ImageGrid({ images }: { images: { image: string; url: string } }) {
	const imgGrid = images.map((recipe, index) => (
		<a href={recipe.url}>
			<div key={index} className="w-full aspect-square">
				<img
					src={recipe.image}
					className="w-full h-full object-cover rounded-lg"
				/>
			</div>
		</a>
	));

	return <div className="grid grid-flow-col gap-2">{imgGrid}</div>;
}

export default function SimilarRecipes({
	recommendedRecipes,
}: {
	recommendedRecipes: { image: string; url: string };
}) {
	return (
		<div className="sticky bottom-0 h-auto bg-white w-full p-3 flex flex-col">
			<h2 className="text-2xl ml-2 font-bold mb-2">Similar Recipes:</h2>
			<ImageGrid images={recommendedRecipes} />
		</div>
	);
}
