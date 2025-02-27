type Ingredient = {
	ingredient: string;
	amount: number;
	unit: string;
};

type RecipeIngredientsProps = {
	ingredients: Ingredient[];
};

function ingredient(ingredient: Ingredient) {
	return (
		<>
			<li className="flex flex-row">
				<div className="w-9/12">{ingredient.ingredient}</div>
				<div className="w-3/12">
					{ingredient.amount} {ingredient.unit}
				</div>
			</li>
		</>
	);
}

export default function RecipeIngredients(props: RecipeIngredientsProps) {
	return <></>;
}
