import React, { useCallback, useState } from "react";
import { Card } from "@components/ui/card";
import { GripVertical } from "lucide-react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { type InstructionItem } from "./instructions";

/**
 * A component that allows the user to add a new instruction to the recipe.
 */
export const AddNewInstruction = ({
  onAddInstruction,
  currentInstructionIndex,
}: {
  onAddInstruction: (instruction: InstructionItem) => void;
  currentInstructionIndex: number;
}) => {
  const [instructionInput, setInstructionInput] = useState<string>("");

  const handleAddInstruction = useCallback(() => {
    if (instructionInput.trim() === "") return;
    onAddInstruction({
      id: currentInstructionIndex + 1,
      instruction: instructionInput,
    });
    setInstructionInput("");
  }, [setInstructionInput, instructionInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Escape":
        break;
      case "Enter":
        e.preventDefault();
        handleAddInstruction();
        break;
    }
  };

  return (
    <Card className="p-2 flex items-center justify-between gap-3 flex-row">
      <div className="flex flex-row gap-3 items-center">
        <GripVertical
          color="grey"
          className=" cursor-not-allowed align-middle w-6 h-6"
        />
        <span className="font-medium ml-2">{currentInstructionIndex + 1}</span>
      </div>
      <Input
        value={instructionInput}
        placeholder="Enter New Instruction"
        className="w-full border-0 text-sm shadow-none focus:border-0 focus:outline-none focus-visible:ring-0"
        type="text"
        onKeyDown={handleKeyDown}
        onChange={(e) => setInstructionInput(e.target.value)}
      />
      <Button type="button" onClick={handleAddInstruction}>
        Add
      </Button>
    </Card>
  );
};
