import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Pen, Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "../../../ui/input";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { type InstructionItem as InstructionItemType } from "./instructions";
import { RECIPE } from "@flayva-monorepo/shared/constants";

/**
 * A component to view and manage a single instruction item in the recipe creation process.
 */
export const InstructionItem = ({
  instrucionNumber,
  handleDeleteSelf,
  handleEditSelf,
  instruction,
}: {
  instrucionNumber: number;
  handleDeleteSelf: () => void;
  handleEditSelf: (
    editedInstruction: InstructionItemType["instruction"]
  ) => void;
  instruction: InstructionItemType;
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [instructionTextPreview, setInstructionTextPreview] = useState<string>(
    instruction.instruction
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: instruction.id });

  const isValidEdit = useMemo(
    () =>
      instructionTextPreview.length >=
        RECIPE.RECIPE_INSTRUCTION_MIN_STEP_LENGTH &&
      instructionTextPreview.length <=
        RECIPE.RECIPE_INSTRUCTION_MAX_STEP_LENGTH,
    [instructionTextPreview]
  );

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(false);
    handleEditSelf(instructionTextPreview);
  };

  const onCancelEdit = useCallback(() => {
    setIsEditing(false);
    setInstructionTextPreview(instruction.instruction);
  }, [inputRef, instruction.instruction]);

  const onEditButtonClick = useCallback(() => {
    setIsEditing(true);
    handleEditSelf(instructionTextPreview);
  }, [inputRef, instructionTextPreview, handleEdit]);

  const onDeleteButtonClick = useCallback(() => {
    handleDeleteSelf();
  }, [handleDeleteSelf]);

  const handleInputKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Escape":
          if (isEditing) onCancelEdit();
          break;
        case "Enter":
          e.preventDefault();
          if (isEditing) handleEdit();
          break;
      }
    },
    [instruction, isEditing, handleEdit, onCancelEdit]
  );

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="p-1 hover:bg-accent/50 w-full"
    >
      <div className="p-1 flex flex-row items-center justify-between gap-3">
        <div className="flex flex-row gap-3 items-center">
          <GripVertical
            size={20}
            className="cursor-pointer align-middle"
            {...attributes}
            {...listeners}
          />
          <span className="font-medium ml-2">{instrucionNumber}</span>
        </div>
        <Input
          onKeyDown={handleInputKeyDown}
          ref={inputRef}
          value={instructionTextPreview}
          onChange={(e) => setInstructionTextPreview(e.target.value)}
          placeholder="Enter New Instruction"
          className={cn(
            "shadow-none border-0 text-sm resize-none field-sizing-content",
            {
              "border-2": isEditing,
            }
          )}
          disabled={!isEditing}
        />
        {isEditing ? (
          <div className="flex flex-row gap-2">
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEdit} disabled={!isValidEdit}>
              Confirm
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              className="size-8 hover:bg-background hover:cursor-pointer"
              onClick={onEditButtonClick}
            >
              <Pen className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="size-8 hover:bg-background hover:cursor-pointer"
              onClick={onDeleteButtonClick}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
