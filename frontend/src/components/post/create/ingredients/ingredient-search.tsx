import React, { SetStateAction } from "react";
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

export function IngredientSearch({
  setIngredient,
  setValue,
  value,
}: {
  setIngredient: React.Dispatch<SetStateAction<string | null>>;
  setValue: React.Dispatch<SetStateAction<string>>;
  value: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { data, isError, isLoading } =
    useFetchIngredientsFromSearchQuery(value);
  const ingredients = data?.ingredients || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {ingredients && ingredients.length > 0
            ? ingredients[0].name
            : "Select ingredient..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search ingredient..."
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? "Loading..."
                : isError
                ? "Error fetching ingredients."
                : "No ingredient found."}
            </CommandEmpty>
            <CommandGroup>
              {ingredients.map(
                (ingredient: {
                  name: string;
                  id: number;
                  group: string;
                  subgroup: string;
                }) => (
                  <CommandItem
                    key={ingredient.id}
                    value={ingredient.name}
                    onSelect={(currentValue) => {
                      const selected =
                        currentValue === value ? "" : currentValue;
                      setValue(selected);
                      setIngredient(
                        selected
                          ? JSON.stringify({
                              name: ingredient.name,
                              id: ingredient.id,
                            })
                          : null
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === ingredient.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {ingredient.name}
                  </CommandItem>
                )
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default IngredientSearch;
