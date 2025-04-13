import { useState, useEffect, useCallback } from "react";
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
import IngredientSearch from "./ingredient-search";
import React from "react";
import IngredientsList from "./ingredients-list";
import { Card } from "@/components/ui/card";

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
  ingredientsList,
  editingIngredient,
  onSave,
  setError,
  setEditingIngredient,
  deleteIngredientFromList,
}: {
  ingredientsList: IngredientEntry[];
  editingIngredient?: IngredientEntry | null;
  onSave: (ingredient: IngredientEntry, isEditing: boolean) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingIngredient: React.Dispatch<
    React.SetStateAction<IngredientEntry | null>
  >;
  deleteIngredientFromList: (id: number) => void;
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(
    null
  );
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>();
  const [wholeNumber, setWholeNumber] = useState<number | null>(null);
  const [numerator, setNumerator] = useState<number | null>(null);
  const [denominator, setDenominator] = useState<number | null>(null);
  const [searchValue, setSearchValue] = React.useState("");

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

  const handleSave = useCallback(async () => {
    if (!selectedIngredient || !selectedUnit) return;
    const ingredient = JSON.parse(selectedIngredient);
    const isEditing = !!editingIngredient;
    setOpen(false);
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
  }, [
    selectedIngredient,
    selectedUnit,
    wholeNumber,
    numerator,
    denominator,
    ingredientsList,
    editingIngredient,
    onSave,
    setError,
  ]);

  const resetValues = () => {
    setWholeNumber(null);
    setNumerator(null);
    setDenominator(null);
    setSelectedIngredient("");
    setSelectedUnit("");
    setError("");
    setSearchValue("");
  };

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      switch (e.key) {
        case "Escape":
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          handleSave();
          break;
      }
    },
    [handleSave]
  );

  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <IngredientsList
        setEditingIngredient={setEditingIngredient}
        deleteIngredientFromList={deleteIngredientFromList}
        ingredientsList={ingredientsList}
      />

      <Card className="p-1">
        <div className="p-1 items-center justify-between gap-3">
          <div className="flex flex-row gap-3 items-center">
            <div className="flex-1">
              <IngredientSearch
                setIngredient={setSelectedIngredient}
                value={searchValue}
                setValue={setSearchValue}
                editingIngredient={editingIngredient}
              />
            </div>
            <div className="flex-1">
              <Select
                value={selectedUnit}
                onValueChange={setSelectedUnit}
                disabled={!selectedIngredient}
              >
                <SelectTrigger className="w-full">
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
            </div>

            <div
              onKeyDown={handleKeyDown}
              tabIndex={-1}
              className="outline-none "
            >
              <NumberSelector
                wholeNumber={wholeNumber}
                numerator={numerator}
                denominator={denominator}
                selectedIngredient={selectedIngredient}
                setWholeNumber={setWholeNumber}
                setDenominator={setDenominator}
                setNumerator={setNumerator}
                open={open}
                setOpen={setOpen}
              />
            </div>

            <Button type="button" onClick={handleSave} className="max-w-18">
              {editingIngredient ? "Save" : "Add"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IngredientSelector;
