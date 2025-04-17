import InstructionItem from "./instruction-item";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
type instructionSchema = { id: number; instruction: string };

const InstructionListComponent = ({
  instructions,
  deleteInstructionFromList,
  setEditingInstruction,
}: {
  instructions: instructionSchema[];
  deleteInstructionFromList: (stepNumber: number) => void;
  setEditingInstruction: (instruction: instructionSchema) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <SortableContext
        items={instructions}
        strategy={verticalListSortingStrategy}
      >
        {instructions.map((instruction: instructionSchema) => (
          <div>
            <InstructionItem
              instruction={instruction}
              key={instruction.instruction}
              deleteInstructionFromList={deleteInstructionFromList}
              setEditingInstruction={setEditingInstruction}
            ></InstructionItem>
          </div>
        ))}
      </SortableContext>
    </div>
  );
};

export default InstructionListComponent;
