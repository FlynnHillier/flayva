import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { NumberSelector } from "./fraction-builder";
import { IngredientEntry } from "./ingredient-entry-schema";

const ingredientUnits = [
  "kg",
  "ml",
  "g",
  "l",
  "tbsp",
  "tsp",
  "cup",
  "pinch",
  "dash",
  "whole",
];

const IngredientSelector = ({
  ingredients,
  ingredientsList,
  editingIngredient,
  onSave,
  setError,
}: {
  ingredients: { id: number; name: string; group: string }[] | null;
  ingredientsList: IngredientEntry[];
  editingIngredient?: IngredientEntry | null;
  onSave: (ingredient: IngredientEntry, isEditing: boolean) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState<
    string | undefined
  >();
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>();
  const [wholeNumber, setWholeNumber] = useState<number | null>(null);
  const [numerator, setNumerator] = useState<number | null>(null);
  const [denominator, setDenominator] = useState<number | null>(null);

  useEffect(() => {
    if (editingIngredient) {
      setSelectedIngredient(
        JSON.stringify({
          id: editingIngredient.ingredient_id,
          name: editingIngredient.name,
        })
      );
      setSelectedUnit(editingIngredient.unit);
      setWholeNumber(editingIngredient.amount_whole);
      setNumerator(editingIngredient.amount_fractional_numerator);
      setDenominator(editingIngredient.amount_fractional_denominator);
    }
  }, [editingIngredient]);

  const handleSave = async () => {
    if (!selectedIngredient || !selectedUnit) return;

    const ingredient = JSON.parse(selectedIngredient);
    const isEditing = !!editingIngredient;

    const updatedIngredient: IngredientEntry = {
      ingredient_id: isEditing
        ? editingIngredient.ingredient_id
        : ingredient.id,
      name: ingredient.name,
      amount_whole: wholeNumber ?? 0,
      amount_fractional_numerator: numerator ?? 0,
      amount_fractional_denominator: denominator ?? 0,
      unit: selectedUnit,
    };

    if (!isEditing) {
      const exists = ingredientsList.some(
        (entry) => entry.ingredient_id === ingredient.id
      );

      if (exists) {
        setError(
          "Ingredient already added - please delete or edit the ingredient"
        );
        return;
      }
    }

    await onSave(updatedIngredient, isEditing);
    resetValues();
  };

  const resetValues = () => {
    setWholeNumber(null);
    setNumerator(null);
    setDenominator(null);
    setSelectedIngredient("");
    setSelectedUnit("");
    setError("");
  };

  return (
    <div>
      <div className="flex flex-row gap-2">
        <Select
          value={selectedIngredient}
          onValueChange={setSelectedIngredient}
          disabled={!!editingIngredient}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select Ingredient" />
          </SelectTrigger>
          <SelectContent>
            {ingredients?.map((ingredient) => (
              <SelectItem
                key={ingredient.id}
                value={JSON.stringify(ingredient)}
              >
                {ingredient.name}
              </SelectItem>
            ))}
            {editingIngredient && (
              <SelectItem
                value={JSON.stringify({
                  id: editingIngredient.ingredient_id,
                  name: editingIngredient.name,
                })}
                className="hidden"
                disabled
              >
                {editingIngredient.name}
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select
          value={selectedUnit}
          onValueChange={setSelectedUnit}
          disabled={!selectedIngredient}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Unit" />
          </SelectTrigger>
          <SelectContent>
            {ingredientUnits.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <NumberSelector
          wholeNumber={wholeNumber}
          numerator={numerator}
          denominator={denominator}
          selectedIngredient={selectedIngredient}
          setWholeNumber={setWholeNumber}
          setDenominator={setDenominator}
          setNumerator={setNumerator}
        />

        <Button type="button" onClick={handleSave} className="max-w-18">
          {editingIngredient ? "Save" : "Add"}
        </Button>
      </div>
    </div>
  );
};

export default IngredientSelector;
