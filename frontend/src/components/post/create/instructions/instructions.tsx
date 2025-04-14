import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useCallback } from "react";
import { InstructionItem } from "./instruction-item";
import { AddNewInstruction } from "./instruction-add";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";

export type InstructionItem = { id: number; instruction: string };

/**
 * A component to manage a list of instructions for a recipe.
 * It allows users to add, edit, and delete instructions,
 */
export const InstructionsHandler = ({
  instructions,
  setInstructions,
}: {
  instructions: InstructionItem[];
  setInstructions: React.Dispatch<React.SetStateAction<InstructionItem[]>>;
}) => {
  /**
   * Handles the deletion of an instruction from the list.
   */
  const handleDeleteInstruction = useCallback(
    (instructionId: number) => {
      setInstructions((p) => p.filter((inst) => inst.id !== instructionId));
    },
    [setInstructions]
  );

  /**
   * Handles the addition of a new instruction to the list.
   */
  const handleAddInstruction = useCallback(
    (instruction: InstructionItem) => {
      setInstructions((p) => [...p, instruction]);
    },
    [setInstructions]
  );

  const handleEditInstruction = useCallback(
    (instructionId: number, instructionText: string) => {
      setInstructions((p) =>
        p.map((inst) => {
          if (inst.id === instructionId) {
            return { ...inst, instruction: instructionText };
          }
          return inst;
        })
      );
    },
    [setInstructions]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    // swap the indexes of the dragged instruction with the index it was dropped on

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = instructions.findIndex(
      (inst) => inst.id === Number(active.id)
    );
    const to = instructions.findIndex((inst) => inst.id === Number(over.id));

    if (from === -1 || to === -1) return;

    setInstructions((instructions) => arrayMove(instructions, from, to));
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-2">
        <SortableContext
          items={instructions}
          strategy={verticalListSortingStrategy}
        >
          {instructions.map((instruction, i) => (
            <InstructionItem
              instrucionNumber={i + 1}
              instruction={instruction}
              key={instruction.instruction}
              handleDeleteSelf={() => {
                handleDeleteInstruction(instruction.id);
              }}
              handleEditSelf={(editedInstruction) =>
                handleEditInstruction(instruction.id, editedInstruction)
              }
            />
          ))}
        </SortableContext>
        <AddNewInstruction
          currentInstructionIndex={instructions.length}
          onAddInstruction={handleAddInstruction}
        />
      </div>
    </DndContext>
  );
};
