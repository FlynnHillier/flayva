import { Input } from "@components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const currentIndexRef = useRef(0);
  const [fractionError, setFractionError] = useState("");
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
    setFractionError("");
    if (
      denominator != null &&
      (Number(value) === denominator || Number(value) > denominator)
    ) {
      console.log("errror");
      console.log(value, denominator);
      setFractionError("Denominator must be larger than numerator. ");
    }
    setNumerator(
      value === "" ? null : Math.max(0, parseInt(value, 10)) || null
    );
  };

  const handleDenominatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFractionError("");
    if (numerator === null) {
      setFractionError("Numerator must be selected first. ");
    } else if (Number(value) === numerator || Number(value) < numerator) {
      setFractionError("Denominator must be larger than numerator. ");
    }
    const num = parseInt(value, 10);
    setDenominator(value === "" ? null : num >= 2 ? num : null);
  };

  const displayValue = [
    wholeNumber?.toString(),
    hasFraction
      ? wholeNumber
        ? "& " + `${numerator}/${denominator}`
        : `${numerator}/${denominator}`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Escape":
        case "Tab":
          e.preventDefault();
          const direction = e.shiftKey ? -1 : 1;
          const newIndex = (currentIndexRef.current + direction + 3) % 3;

          // Update the ref immediately
          currentIndexRef.current = newIndex;

          // Focus the next input
          inputRefs.current[newIndex]?.focus();
          break;
        case "Enter":
          e.preventDefault();
          break;
      }
    },
    []
  );

  const addToRefs = useCallback(
    (el: HTMLInputElement | null, index: number) => {
      inputRefs.current[index] = el;
    },
    []
  );

  const resetIndexRef = () => {
    currentIndexRef.current = 0;
  };

  useEffect(() => {
    console.log(open);
    if (open != null && open === false) {
      resetIndexRef();
    }
  }, [open]);

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
            ref={(el) => addToRefs(el, 0)}
            onKeyDown={handleKeyDown}
            autoFocus={true}
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
              ref={(el) => addToRefs(el, 1)}
              onKeyDown={handleKeyDown}
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
              ref={(el) => addToRefs(el, 2)}
              onKeyDown={handleKeyDown}
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
        <div className="flex flex-col gap-3">
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
                resetIndexRef();
              }}
            >
              Clear All
            </Button>
          </div>
          <span className="text-red-600 text-xs flex justify-center">
            {fractionError}
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
