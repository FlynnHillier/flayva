import { useCallback, useState } from "react";
import { useFetchIngredientsFromSearchQuery } from "@/hooks/ingredient.hooks";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "use-debounce";

import { RecipeIngredientItem } from "@flayva-monorepo/shared/types";

/**
 * A component that allows the user to search for ingredients and select one from a list.
 */
export function IngredientSelect({
  ignoreIngredientIds,
  onIngredientSelect,
  selectedIngredient,
}: {
  ignoreIngredientIds?: number[];
  selectedIngredient: RecipeIngredientItem | null;
  onIngredientSelect: (ingredient: RecipeIngredientItem) => void;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [showPopover, setShowPopover] = useState(false);

  const {
    data: ingredients,
    isError,
    isLoading,
  } = useFetchIngredientsFromSearchQuery(debouncedSearchValue);

  // When a user selects an ingredient from the search results list, this function is called.
  const onSelection = useCallback(
    (ingredient: RecipeIngredientItem) => {
      if (ingredient.id === selectedIngredient?.id) return;
      setShowPopover(false);

      onIngredientSelect(ingredient);
    },
    [selectedIngredient, onIngredientSelect]
  );

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={showPopover}
          className="w-48 justify-start gap-x-2 truncate"
        >
          <ChevronsUpDown className="h-4 w-4 shrink-0 " />
          {selectedIngredient?.name || (
            <span className="text-muted-foreground">Select ingredient</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput
            placeholder="Search ingredient..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                "Loading..."
              ) : isError ? (
                <span className="text-red-500">
                  Error fetching ingredients.
                </span>
              ) : (
                "No ingredient found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {ingredients?.map((ingredient) => (
                <CommandItem
                  disabled={
                    ingredient.id === selectedIngredient?.id ||
                    ignoreIngredientIds?.includes(ingredient.id)
                  }
                  key={ingredient.id}
                  value={ingredient.name}
                  onSelect={() => onSelection(ingredient)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedIngredient?.id === ingredient.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {ingredient.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
