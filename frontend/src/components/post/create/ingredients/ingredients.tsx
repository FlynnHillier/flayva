import { useCallback } from "react";
import AddedIngredientsListDisplay from "./ingredients-list";
import { RecipeIngredientEntry } from "@flayva-monorepo/shared/types";
import { AddIngredient } from "./ingredient-add";

/**
 * A component that allows for the management of ingredients in a recipe.
 * It displays a list of added ingredients and provides an interface to add new ingredients.
 */
const IngredientsHandler = ({
  ingredients,
  updateIngredients,
}: {
  ingredients: RecipeIngredientEntry[];
  updateIngredients: (ingredients: RecipeIngredientEntry[]) => void;
}) => {
  /**
   * Deletes an ingredient from the list of ingredients.
   */
  const deleteIngredient = useCallback(
    (id: number) =>
      updateIngredients(
        ingredients.filter((ingredient) => ingredient.id !== id)
      ),
    [ingredients, updateIngredients]
  );

  /**
   * Adds an ingredient to the list of ingredients.
   */
  const addIngredient = useCallback(
    (ingredient: RecipeIngredientEntry) =>
      updateIngredients([...ingredients, ingredient]),
    [ingredients, updateIngredients]
  );

  return (
    <div className="flex flex-col gap-2">
      <AddedIngredientsListDisplay
        ingredients={ingredients}
        onDeleteButtonClick={deleteIngredient}
      />
      <AddIngredient
        onAddIngredient={addIngredient}
        ignoreIngredientIds={ingredients.map((ingredient) => ingredient.id)}
      />
    </div>
  );
};

export default IngredientsHandler;
