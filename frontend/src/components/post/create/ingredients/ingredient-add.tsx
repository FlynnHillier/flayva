import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { RECIPE } from "@flayva-monorepo/shared/validation";
import { useCallback, useMemo, useState } from "react";
import {
  RecipeIngredientEntry,
  RecipeIngredientItem,
  RecipeIngredientUnit,
} from "@flayva-monorepo/shared/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IngredientSelect } from "./ingredient-select";
/**
 * A component that allows the user to select an amount for an ingredient.
 */
const AmountSelector = ({
  disabled,
  onValueChange,
  value,
}: {
  disabled?: boolean;
  onValueChange: (amount: RecipeIngredientEntry["amount"]) => void;
  value: RecipeIngredientEntry["amount"] | undefined;
}) => {
  // Ensure that the key name is always the same as the fraction denoted in the object value,
  // If not, we will have errors.
  const FRACTIONS: Record<
    `${number}/${number}`,
    Exclude<RecipeIngredientEntry["amount"]["fractional"], undefined>
  > = {
    "1/2": {
      numerator: 1,
      denominator: 2,
    },
    "1/3": {
      numerator: 1,
      denominator: 3,
    },
    "2/3": {
      numerator: 2,
      denominator: 3,
    },
    "1/4": {
      numerator: 1,
      denominator: 4,
    },
    "3/4": {
      numerator: 3,
      denominator: 4,
    },
    "1/5": {
      numerator: 1,
      denominator: 5,
    },
    "1/8": {
      numerator: 1,
      denominator: 8,
    },
    "1/10": {
      numerator: 1,
      denominator: 10,
    },
  };

  const updateWholeNumber = useCallback(
    (number: number) => {
      onValueChange({
        fractional: value?.fractional,
        whole: number,
      });
    },
    [onValueChange, value]
  );

  const updateFraction = useCallback(
    (fraction: RecipeIngredientEntry["amount"]["fractional"]) => {
      onValueChange({
        whole: value?.whole ?? 0,
        fractional: fraction,
      });
    },
    [onValueChange, value]
  );

  return (
    <div className="flex flex-row flex-nowrap items-center gap-x-2">
      {/* Whole number */}
      <Select
        value={value?.whole?.toString() ?? "0"}
        onValueChange={(value) => updateWholeNumber(Number(value))}
        disabled={disabled}
      >
        <SelectTrigger className="w-16 caret-transparent">
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 10 }, (_, i) => (
            <SelectItem key={i} value={i.toString()}>
              {i.toString()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className={cn({ "text-muted-foreground": disabled })}> & </span>
      {/* Fraction */}
      <Select
        disabled={disabled}
        value={
          value?.fractional
            ? `${value.fractional.numerator}/${value.fractional.denominator}` //If we change the keys, we need to update this
            : "NONE"
        }
        onValueChange={(value) => {
          if (value === "NONE") updateFraction(undefined);
          else {
            const fraction = FRACTIONS[value as keyof typeof FRACTIONS];
            if (fraction) {
              updateFraction(fraction);
            }
          }
        }}
      >
        <SelectTrigger className="w-32 caret-transparent">
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="text-xs text-muted-foreground" value="NONE">
            No Fraction
          </SelectItem>
          {Object.entries(FRACTIONS)
            .sort(
              ([_, a], [__, b]) =>
                a.numerator / a.denominator - b.numerator / b.denominator
            )
            .map(([fractionAsString, fraction], i) => {
              return (
                <SelectItem
                  key={i + 1}
                  value={fractionAsString}
                  className="flex flex-row justify-between items-center"
                >
                  <span>{fractionAsString}</span>
                  <span className="text-xs text-muted-foreground grow">
                    {Math.floor(
                      (fraction.numerator / fraction.denominator) * 100
                    ) / 100}
                  </span>
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
    </div>
  );
};

/**
 * A component that allows users to select an ingredient unit from a dropdown list.
 */
const UnitSelector = ({
  onUnitSelect,
  selectedUnit,
  disabled,
}: {
  onUnitSelect: (unit: RecipeIngredientUnit) => void;
  selectedUnit: RecipeIngredientUnit | undefined;
  disabled?: boolean;
}) => (
  <Select
    value={selectedUnit ?? ""}
    onValueChange={onUnitSelect}
    disabled={disabled}
  >
    <SelectTrigger className="w-36">
      <SelectValue placeholder="Select Unit" />
    </SelectTrigger>
    <SelectContent>
      {RECIPE.ingredient_unit.options.map((unit) => (
        <SelectItem value={unit} key={unit}>
          {unit}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const AddIngredient = ({
  ignoreIngredientIds,
  onAddIngredient,
}: {
  ignoreIngredientIds?: number[];
  onAddIngredient: (ingredientEntry: RecipeIngredientEntry) => void;
}) => {
  const [selectedIngredient, setSelectedIngredient] =
    useState<RecipeIngredientItem | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<
    RecipeIngredientUnit | undefined
  >(undefined);
  const [amount, setAmount] = useState<RecipeIngredientEntry["amount"]>({
    whole: 0,
    fractional: undefined,
  });

  const isValidIngredient = useMemo<boolean>(
    () =>
      selectedIngredient !== null &&
      selectedUnit !== undefined &&
      amount !== null &&
      !(amount.whole === 0 && amount.fractional === undefined),
    [
      selectedIngredient,
      selectedUnit,
      amount,
      amount?.whole,
      amount?.fractional,
    ]
  );

  const clearValues = useCallback(() => {
    setSelectedIngredient(null);
    setSelectedUnit(undefined);
    setAmount({
      whole: 0,
      fractional: undefined,
    });
  }, [setSelectedIngredient, setSelectedUnit, setAmount]);

  const handleAddButtonClick = useCallback(() => {
    if (
      selectedIngredient !== null &&
      selectedUnit !== undefined &&
      amount !== null
    ) {
      // Call onAddIngredient with the selected ingredient, unit, and amount
      // and clear the values
      onAddIngredient({
        id: selectedIngredient.id,
        name: selectedIngredient.name,
        amount: {
          whole: amount.whole,
          fractional: amount.fractional,
        },
        unit: selectedUnit,
      });

      clearValues();
    }
  }, [selectedIngredient, selectedUnit, onAddIngredient]);

  return (
    <Card className="p-2">
      <div className="flex flex-row gap-3 items-center justify-start">
        <IngredientSelect
          onIngredientSelect={setSelectedIngredient}
          selectedIngredient={selectedIngredient}
          ignoreIngredientIds={ignoreIngredientIds}
        />

        <AmountSelector
          value={amount}
          disabled={selectedIngredient === null}
          onValueChange={setAmount}
        />

        <UnitSelector
          selectedUnit={selectedUnit}
          onUnitSelect={setSelectedUnit}
          disabled={selectedIngredient === null}
        />

        <Button
          type="button"
          disabled={!isValidIngredient}
          className="max-w-16 ml-auto"
          onClick={handleAddButtonClick}
        >
          {"Add"}
        </Button>
      </div>
    </Card>
  );
};
