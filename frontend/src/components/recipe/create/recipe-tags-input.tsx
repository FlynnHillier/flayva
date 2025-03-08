import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X as RemoveIcon } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { RecipeTag } from "@apptypes/recipe.types";
import { queries } from "@/queries";

function SelectedTag({
  tag,
  onRemove,
  disabled,
  active,
}: {
  tag: RecipeTag;
  onRemove: () => void;
  disabled: boolean;
  active: boolean;
}) {
  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <Badge
      // tabIndex={activeIndex !== -1 ? 0 : activeIndex}
      key={tag.tagId}
      aria-disabled={disabled}
      data-active={active}
      className={cn(
        "relative px-1 rounded flex items-center gap-1 data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground truncate aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
      )}
      variant={"secondary"}
    >
      <span className="text-xs">{tag.tagName}</span>
      <button
        type="button"
        aria-label={`Remove ${tag} option`}
        aria-roledescription="button to remove option"
        disabled={disabled}
        onMouseDown={mousePreventDefault}
        onClick={onRemove}
        className="disabled:cursor-not-allowed"
      >
        <span className="sr-only">Remove {tag.tagId} option</span>
        <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
      </button>
    </Badge>
  );
}

function SuggestionTag({
  suggestion,
  isActive,
  onClick,
}: {
  suggestion: RecipeTag;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      key={suggestion.tagId}
      onClick={onClick}
      className={cn("block w-full p-2 text-left", {
        "font-semibold bg-gray-200": isActive,
      })}
    >
      {suggestion.tagName}
    </button>
  );
}

/**
 * @name TagsInput
 * @description A component that allows users to input multiple tags
 *
 * T is the type of the suggestion object
 */
interface TagsInputProps extends React.HTMLAttributes<HTMLDivElement> {
  tags: RecipeTag[];
  onTagsChange: (value: RecipeTag[]) => void;
  placeholder?: string;
  maxItems?: number;
  minItems?: number;
}
export function TagsInput({
  children,
  tags,
  onTagsChange,
  placeholder,
  maxItems,
  minItems,
  className,
  dir,
  ...props
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue] = useDebounce(inputValue, 500);

  const [activeSelectedTagIndex, setActiveSelectedTagIndex] = useState<number>(-1);
  const [selectedInputTextValue, setSelectedInputTextValue] = useState<string>("");

  const [suggestions, setSuggestions] = useState<RecipeTag[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

  const [disableInput, setDisableInput] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const parseMinItems = minItems ?? 0;
  const parseMaxItems = maxItems ?? Infinity;

  const {
    data: suggestionsQueryData,
    isLoading,
    error,
  } = useQuery({
    ...queries.recipe.querySuggestedSimilarTags(debouncedInputValue),
    enabled: Boolean(debouncedInputValue),
  });

  useEffect(() => {
    const VerifyDisable = () => {
      if (tags.length - 1 >= parseMinItems) {
        setDisableButton(false);
      } else {
        setDisableButton(true);
      }
      if (tags.length + 1 <= parseMaxItems) {
        setDisableInput(false);
      } else {
        setDisableInput(true);
      }
    };
    VerifyDisable();
  }, [tags]);

  // ## Manage Selected Tags ##
  const addSelectedTag = useCallback(
    (tag: RecipeTag) => {
      if (!tags.includes(tag) && tags.length < parseMaxItems) {
        onTagsChange([...tags, tag]);
      }
    },
    [tags]
  );

  const removeSelectedTag = useCallback(
    (tag: RecipeTag) => {
      if (tags.includes(tag) && tags.length > parseMinItems) {
        onTagsChange(tags.filter((item) => item !== tag));
      }
    },
    [tags]
  );

  // ## Manage Suggestions ##

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, [setSuggestions]);

  function handleTagSuggestionSelected(tag: RecipeTag) {
    addSelectedTag(tag);
    clearSuggestions();
    setInputValue("");
  }

  useEffect(() => {
    setSuggestions((prev) =>
      prev.filter((suggestion) => !tags.some((tag) => tag.tagId === suggestion.tagId))
    );
  }, [tags]);

  useEffect(() => {
    if (!suggestionsQueryData) return clearSuggestions();
    setSuggestions(
      suggestionsQueryData.filter(
        (suggestion) => !tags.some((tag) => tag.tagId === suggestion.tagId)
      )
    );
  }, [suggestionsQueryData]);

  useEffect(() => {
    // Clear the suggestion index when the suggestions become empty
    if (!suggestions || suggestions.length === 0) return setActiveSuggestionIndex(-1);

    // Reset the suggestion index when the suggestions change
    setActiveSuggestionIndex(0);
  }, [suggestions]);

  function selectActiveSuggestion() {
    if (activeSuggestionIndex === -1) return;
    handleTagSuggestionSelected(suggestions[activeSuggestionIndex]);
  }

  // ## MISC ##
  const handleInputTextSelection = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      const selection = target.value.substring(
        target.selectionStart ?? 0,
        target.selectionEnd ?? 0
      );

      setSelectedInputTextValue(selection);
    },
    [inputValue]
  );

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();

      // ## Selected Tag Interaction ##
      const moveSelectedTagNext = () => {
        const nextIndex =
          activeSelectedTagIndex + 1 > tags.length - 1 ? -1 : activeSelectedTagIndex + 1;
        setActiveSelectedTagIndex(nextIndex);
      };

      const moveSelectedTagPrev = () => {
        const prevIndex =
          activeSelectedTagIndex - 1 < 0 ? tags.length - 1 : activeSelectedTagIndex - 1;
        setActiveSelectedTagIndex(prevIndex);
      };

      const moveSelectedTagCurrent = () => {
        const newIndex =
          activeSelectedTagIndex - 1 <= 0
            ? tags.length - 1 === 0
              ? -1
              : 0
            : activeSelectedTagIndex - 1;
        setActiveSelectedTagIndex(newIndex);
      };

      // ## Suggestion Interaction ##
      const moveSuggestionNext = () => {
        if (!suggestions || activeSuggestionIndex === -1) return;
        const nextIndex =
          activeSuggestionIndex + 1 < suggestions.length ? activeSuggestionIndex + 1 : 0;
        setActiveSuggestionIndex(nextIndex);
      };

      const moveSuggestionPrev = () => {
        if (!suggestions || activeSuggestionIndex === -1) return;

        const prevIndex =
          activeSuggestionIndex - 1 < 0 ? suggestions.length - 1 : activeSuggestionIndex - 1;
        setActiveSuggestionIndex(prevIndex);
      };

      // Handle the keydown event
      const target = e.currentTarget;
      switch (e.key) {
        // ## Selected Tag Interaction ##
        case "ArrowLeft":
          if (dir === "rtl") {
            if (tags.length > 0 && activeSelectedTagIndex !== -1) {
              moveSelectedTagNext();
            }
          } else {
            if (tags.length > 0 && target.selectionStart === 0) {
              moveSelectedTagPrev();
            }
          }
          break;

        case "ArrowRight":
          if (dir === "rtl") {
            if (tags.length > 0 && target.selectionStart === 0) {
              moveSelectedTagPrev();
            }
          } else {
            if (tags.length > 0 && activeSelectedTagIndex !== -1) {
              moveSelectedTagNext();
            }
          }
          break;

        case "Backspace":
        case "Delete":
          if (tags.length > 0) {
            if (activeSelectedTagIndex !== -1 && activeSelectedTagIndex < tags.length) {
              removeSelectedTag(tags[activeSelectedTagIndex]);
              moveSelectedTagCurrent();
            } else {
              if (target.selectionStart === 0) {
                if (selectedInputTextValue === inputValue) {
                  removeSelectedTag(tags[tags.length - 1]);
                }
              }
            }
          }
          break;
        case "Escape":
          const newIndex = activeSelectedTagIndex === -1 ? tags.length - 1 : -1;
          setActiveSelectedTagIndex(newIndex);
          break;

        // ## Suggestion Interaction ##
        case "Tab":
          e.preventDefault();
          moveSuggestionNext();
          break;
        case "ArrowDown":
          e.preventDefault();
          moveSuggestionNext();
          break;
        case "ArrowUp":
          e.preventDefault();
          moveSuggestionPrev();
          break;
        case "Enter":
          selectActiveSuggestion();
          break;
      }
    },
    [
      activeSelectedTagIndex,
      tags,
      inputValue,
      removeSelectedTag,
      suggestions,
      activeSuggestionIndex,
    ]
  );

  const handleInputValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  }, []);

  return (
    <>
      <div
        {...props}
        // ref={ref}
        dir={dir}
        className={cn(
          "flex items-center flex-wrap gap-1 p-1 rounded-lg bg-background overflow-hidden   ring-1 ring-muted  ",
          {
            "focus-within:ring-ring": activeSelectedTagIndex === -1,
          },
          className
        )}
      >
        {tags.map((tag, index) => (
          <SelectedTag
            active={activeSelectedTagIndex === index}
            disabled={disableButton}
            onRemove={() => {
              removeSelectedTag(tag);
            }}
            tag={tag}
            key={tag.tagId}
          />
        ))}
        <Input
          tabIndex={0}
          aria-label="input tag"
          disabled={disableInput}
          onKeyDown={handleKeyDown}
          value={inputValue}
          onSelect={handleInputTextSelection}
          onChange={activeSelectedTagIndex === -1 ? handleInputValueChange : undefined}
          placeholder={placeholder}
          onClick={() => setActiveSelectedTagIndex(-1)}
          className={cn(
            "outline-0 border-none h-7 min-w-fit flex-1 focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 placeholder:text-muted-foreground px-1",
            activeSelectedTagIndex !== -1 && "caret-transparent"
          )}
        />
      </div>
      <div
        className={cn(
          "absolute mt-0.5 z-10 w-full bg-background shadow-lg rounded-b-sm overflow-hidden",
          {
            hidden: !suggestions || suggestions.length === 0,
          }
        )}
      >
        {suggestions.map((suggestion, index) => (
          <SuggestionTag
            isActive={activeSuggestionIndex === index}
            suggestion={suggestion}
            onClick={() => handleTagSuggestionSelected(suggestion)}
            key={suggestion.tagId}
          />
        ))}
      </div>
    </>
  );
}

TagsInput.displayName = "TagsInput";
