import React, { SetStateAction } from "react";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import { IngredientEntry } from "./ingredient-entry-schema";
const IngredientsList = ({
  ingredientsList,
  setEditingIngredient,
  deleteIngredientFromList,
}: {
  ingredientsList: IngredientEntry[];
  setEditingIngredient: React.Dispatch<SetStateAction<IngredientEntry | null>>;
  deleteIngredientFromList: (id: number) => void;
}) => {
  return (
    <ul className="space-y-2">
      {ingredientsList.map((ingredient) => (
        <li key={ingredient.ingredient_id}>
          <Card className="p-1 hover:bg-accent/50 ">
            <div className="p-1 flex items-center justify-between gap-3">
              <div>
                <span className="font-medium ml-2">{ingredient.name}</span>
                <span className="ml-2 text-muted-foreground">
                  {ingredient.amount_whole}
                  {ingredient.amount_fractional_numerator !== 0 &&
                    ingredient.amount_fractional_denominator !== 0 && (
                      <span className="ml-1">
                        <sup>{ingredient.amount_fractional_numerator}</sup>
                        &frasl;
                        <sub>{ingredient.amount_fractional_denominator}</sub>
                      </span>
                    )}
                  {ingredient.unit && (
                    <span className="ml-1">{ingredient.unit}</span>
                  )}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="size-8 hover:bg-background"
                  onClick={() => setEditingIngredient(ingredient)}
                >
                  <Pen className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="size-8 hover:bg-background"
                  onClick={() =>
                    deleteIngredientFromList(ingredient.ingredient_id)
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
};

export default IngredientsList;
