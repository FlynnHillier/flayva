import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Pen, Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "../../../ui/input";
import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
type instructionSchema = { id: number; instruction: string };

const InstructionItem = ({
  instruction,
  deleteInstructionFromList,
  setEditingInstruction,
}: {
  instruction: { id: number; instruction: string };
  deleteInstructionFromList: (stepNumber: number) => void;
  setEditingInstruction: (instruction: instructionSchema) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: instruction.id });
  const inputRef = useRef<HTMLInputElement>(null);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [tempInstruction, setTempInstruction] = useState<string>(
    instruction.instruction
  );
  const handleEdit = () => {
    setEditingInstruction({ instruction: tempInstruction, id: instruction.id });
    setIsEditingInstruction(false);
  };
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Escape":
        case "Enter":
          e.preventDefault();
          handleEdit();
          break;
      }
    },
    [instruction]
  );
  const [isEditingInstruction, setIsEditingInstruction] = useState(false);
  return (
    <Card ref={setNodeRef} style={style} className="p-1 hover:bg-accent/50">
      <div className="p-1 flex items-center justify-between gap-3">
        <div className="flex flex-row gap-3 items-center">
          <GripVertical
            size={20}
            className="cursor-pointer align-middle"
            {...attributes}
            {...listeners}
          ></GripVertical>
          <span className="font-medium ml-2">{instruction.id}</span>
        </div>
        <Input
          onKeyDown={handleKeyDown}
          ref={inputRef}
          value={tempInstruction}
          onChange={(e) => setTempInstruction(e.target.value)}
          placeholder="Enter New Instruction"
          className={cn("w-full shadow-none border-0 text-sm", {
            "border-2": isEditingInstruction,
          })}
          type="text"
          disabled={!isEditingInstruction}
        />
        {!isEditingInstruction ? (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="size-8 hover:bg-background"
              onClick={(e) => {
                inputRef?.current?.focus();
                inputRef?.current?.setSelectionRange(5, 5);
                setIsEditingInstruction(true);
              }}
            >
              <Pen className="size-4" />
            </Button>
            <Button
              variant="ghost"
              className="size-8 hover:bg-background"
              onClick={() => deleteInstructionFromList(instruction.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={handleEdit}>Confirm</Button>
        )}
      </div>
    </Card>
  );
};
export default InstructionItem;
