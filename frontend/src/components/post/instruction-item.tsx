import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Pen, Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
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
          <span className="ml-2 text-muted-foreground">
            {instruction.instruction}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="size-8 hover:bg-background"
            onClick={() => setEditingInstruction(instruction)}
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
      </div>
    </Card>
  );
};
export default InstructionItem;
