type Ingredient = {
	ingredient: string;
	amount: number;
	unit: string;
};

type RecipeIngredientsProps = {
	ingredients: Ingredient[];
};

export default function RecipeIngredients(props: RecipeIngredientsProps) {
	const ingredientsList = props.ingredients.map((ingredient) => {
		return (
			<>
				<li className="flex flex-row">
					<div className="w-9/12 text-left text-gray-500">- {ingredient.ingredient}</div>
					<div className="w-3/12 text-gray-500">
						{ingredient.amount} {ingredient.unit}
					</div>
				</li>
			</>
		);
	});
	return <ul>{ingredientsList}</ul>;
}
