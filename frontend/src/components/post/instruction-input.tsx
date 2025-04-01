import React, { useCallback } from "react";
import { Card } from "../ui/card";
import { GripVertical } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
type instructionSchema = { id: number; instruction: string };

const InstructionInput = ({
  instruction,
  instructionList,
  setInstruction,
  addInstructionToList,
}: {
  instruction: string;
  instructionList: instructionSchema[];
  setInstruction: React.Dispatch<React.SetStateAction<string>>;
  addInstructionToList: (
    newInstruction: instructionSchema,
    editing: boolean
  ) => void;
}) => {
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const target = e.currentTarget;
      switch (e.key) {
        case "Escape":

        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          addInstructionToList(
            {
              id: instructionList.length + 1,
              instruction: instruction,
            },
            false
          );
          break;
      }
    },
    [instructionList, instruction]
  );
  return (
    <Card className="p-1">
      <div className="p-1 flex items-center justify-between gap-3">
        <div className="flex flex-row gap-3 items-center">
          <GripVertical
            size={20}
            color="grey"
            className=" cursor-not-allowed align-middle"
          ></GripVertical>
          <span className="font-medium ml-2">{instructionList.length + 1}</span>
        </div>
        <Input
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter New Instruction"
          className="w-full border-0 text-sm shadow-none focus:border-0 focus:outline-none focus-visible:ring-0"
          type="text"
          disabled={false}
        />
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            addInstructionToList(
              {
                id: instructionList.length + 1,
                instruction: instruction,
              },
              false
            );
          }}
        >
          Add
        </Button>
      </div>
    </Card>
  );
};

export default InstructionInput;
