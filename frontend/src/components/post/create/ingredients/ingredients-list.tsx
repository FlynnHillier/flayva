import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import { RecipeIngredientEntry } from "@flayva-monorepo/shared/types";

/**
 * A component that displays a single complete ingredient item
 */
const IngredientItemView = ({
  ingredient,
  onEditButtonClick,
  onDeleteButtonClick,
}: {
  ingredient: RecipeIngredientEntry;
  onEditButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => (
  <Card className="p-1 hover:bg-accent/50 ">
    <div className="p-1 flex items-center justify-between gap-3">
      <div>
        <span className="font-medium ml-2">{ingredient.name}</span>
        <span className="ml-2 text-muted-foreground">
          {ingredient.amount.whole > 0 ? ingredient.amount.whole : null}
          {ingredient.amount.fractional && (
            <span className="ml-1">
              <sup>{ingredient.amount.fractional.numerator}</sup>
              &frasl;
              <sub>{ingredient.amount.fractional.denominator}</sub>
            </span>
          )}
          {ingredient.unit && <span className="ml-1">{ingredient.unit}</span>}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="size-8 hover:bg-background"
          type="button"
          onClick={onEditButtonClick}
        >
          <Pen className="size-4" />
        </Button>
        <Button
          variant="ghost"
          className="size-8 hover:bg-background"
          onClick={onDeleteButtonClick}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  </Card>
);

const AddedIngredientsListDisplay = ({
  ingredients,
  onDeleteButtonClick,
}: {
  ingredients: RecipeIngredientEntry[];
  onDeleteButtonClick: (ingredientId: number) => void;
}) => {
  return (
    <ul className="space-y-2">
      {ingredients.map((ingredient) => (
        <li key={ingredient.id}>
          <IngredientItemView
            ingredient={ingredient}
            onEditButtonClick={() => {
              //TODO: implement edit functionality
            }}
            onDeleteButtonClick={() => {
              onDeleteButtonClick(ingredient.id);
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default AddedIngredientsListDisplay;
