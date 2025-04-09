import { Input } from "@components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import React from "react";

export function NumberSelector({
  wholeNumber,
  numerator,
  denominator,
  selectedIngredient,
  open,
  setWholeNumber,
  setNumerator,
  setDenominator,
  setOpen,
}: {
  wholeNumber: number | null;
  numerator: number | null;
  denominator: number | null;
  selectedIngredient: string | null;
  open: boolean;
  setWholeNumber: React.Dispatch<React.SetStateAction<number | null>>;
  setNumerator: React.Dispatch<React.SetStateAction<number | null>>;
  setDenominator: React.Dispatch<React.SetStateAction<number | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const hasFraction =
    numerator !== null &&
    denominator !== null &&
    numerator != 0 &&
    denominator != 0;

  const handleWholeNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWholeNumber(
      value === "" ? null : Math.max(0, parseInt(value, 10)) || null
    );
  };

  const handleNumeratorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumerator(
      value === "" ? null : Math.max(0, parseInt(value, 10)) || null
    );
  };

  const handleDenominatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseInt(value, 10);
    setDenominator(value === "" ? null : num >= 2 ? num : null);
  };

  const displayValue = [
    wholeNumber?.toString(),
    hasFraction ? "& " + `${numerator}/${denominator}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={!selectedIngredient}
          className="min-w-[120px] font-normal"
          onClick={() => {
            setOpen(true);
          }}
        >
          {displayValue || "Select A Value"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-2 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Whole Number</p>
          <Input
            type="number"
            min="0"
            value={wholeNumber?.toString() || ""}
            onChange={handleWholeNumberChange}
            placeholder="Enter Whole Number"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Fraction</p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min="1"
              value={
                numerator?.toString() && numerator != 0
                  ? numerator?.toString()
                  : ""
              }
              onChange={handleNumeratorChange}
              placeholder="Numerator"
            />
            <Input
              type="number"
              min="2"
              value={
                denominator?.toString() && denominator != 0
                  ? denominator?.toString()
                  : ""
              }
              onChange={handleDenominatorChange}
              placeholder="Denominator"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs w-full text-red-500 hover:text-red-600"
            onClick={() => {
              setNumerator(null);
              setDenominator(null);
            }}
          >
            Clear Fraction
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs w-full text-red-500 hover:text-red-600"
            onClick={() => {
              setWholeNumber(null);
              setNumerator(null);
              setDenominator(null);
            }}
          >
            Clear All
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
