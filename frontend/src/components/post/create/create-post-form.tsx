import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { DropzoneOptions } from "react-dropzone";
import { POST as POST_VALIDATOR } from "@flayva-monorepo/shared/validation";
import { POST as POST_CONSTANTS } from "@flayva-monorepo/shared/constants";
import { toast } from "sonner";
import { Input } from "../../ui/input";
import { TagsInput } from "../../recipe/create/recipe-tags-input";
import IngredientSelector from "./ingredients/ingredients-selector";
import { useCreateNewPost } from "@/hooks/post.hooks";
import { IngredientEntry } from "./ingredients/ingredient-entry-schema";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import InstructionListComponent from "./instructions/instruction-list";
import { arrayMove } from "@dnd-kit/sortable";
import InstructionItem from "./instructions/instruction-item";
import InstructionInput from "./instructions/instruction-input";
import IngredientsList from "./ingredients/ingredients-list";
import { ingredient_unit } from "@flayva-monorepo/shared/validation/recipe.validation";

const { createNewPostSchema } = POST_VALIDATOR;

// TODO: use constants instaed of hard code

/**
 * Handles image file uploads
 */
function ImageSection({
  onValueChange,
  images,
}: {
  onValueChange: (files: File[] | null) => void;
  images: File[];
}) {
  /**
   * Dropzone configuration
   */
  const DROPZONE_CONFIG: DropzoneOptions = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  };

  // TODO: change this to show a preview of the uploaded images instead of just the name
  return (
    <FileUploader
      value={images}
      onValueChange={onValueChange}
      dropzoneOptions={DROPZONE_CONFIG}
      className="relative bg-background rounded-lg p-2"
    >
      <FileInput
        id="fileInput"
        className="outline-dashed outline-1 outline-slate-500"
      >
        <div className="flex items-center justify-center flex-col p-8 w-full ">
          <CloudUpload className="text-gray-500 w-10 h-10" />
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
            &nbsp; or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF
          </p>
        </div>
      </FileInput>
      <FileUploaderContent>
        {images.map((image, i) => (
          <FileUploaderItem key={i} index={i}>
            <Paperclip className="h-4 w-4 stroke-current" />
            <span>{image.name}</span>
          </FileUploaderItem>
        ))}
      </FileUploaderContent>
    </FileUploader>
  );
}

export default function CreateNewPostForm() {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const form = useForm<z.infer<typeof createNewPostSchema>>({
    resolver: zodResolver(createNewPostSchema),
    defaultValues: {
      images: [],
      recipe: {
        tags: [],
        title: "",
        description: "",
        ingredients: [],
        instructions: [],
      },
    },
  });

  type Unit = z.infer<typeof ingredient_unit>;

  const [editingIngredient, setEditingIngredient] =
    useState<IngredientEntry | null>(null);
  const [ingredientsList, setIngredientsList] = useState<IngredientEntry[]>([]);
  const [ingredientError, setIngredientError] = useState<string | null>(null);

  const formatCustomFields = async () => {
    const formattedIngredientsList = ingredientsList.map((ing) => ({
      id: ing.ingredient_id,
      amount: {
        whole: ing.amount_whole,
        fractional:
          ing.amount_fractional_numerator && ing.amount_fractional_denominator
            ? {
                numerator: ing.amount_fractional_numerator,
                denominator: ing.amount_fractional_denominator,
              }
            : undefined,
      },
      unit: ing.unit as Unit,
    }));
    form.setValue("recipe.ingredients", formattedIngredientsList);
    form.setValue("recipe.instructions", instructionList);
    console.log(formattedIngredientsList);
  };

  const deleteIngredientFromList = (id: number) => {
    setIngredientsList((prev) =>
      prev.filter((ingredientEntry) => ingredientEntry.ingredient_id !== id)
    );
  };

  type instructionSchema = { id: number; instruction: string };

  const [instructionList, setInstructionList] = useState<instructionSchema[]>(
    []
  );
  const [instruction, setInstruction] = useState<string>("");
  const [instructionError, setInstructionError] = useState<string>("");
  const addInstructionToList = (
    newInstruction: instructionSchema,
    editing: boolean
  ) => {
    if (newInstruction.instruction.length < 5) {
      setInstructionError("Instruction length too short");
      return;
    }
    if (
      instructionList.some(
        (item) => item.instruction === newInstruction.instruction
      )
    ) {
      setInstructionError("Duplicate found");
      return;
    }
    if (editing) {
      setInstructionList((prev) =>
        prev.map((instruction) =>
          instruction.id === newInstruction.id
            ? {
                id: newInstruction.id,
                instruction: newInstruction.instruction,
              }
            : instruction
        )
      );
      setInstruction("");
      setInstructionError("");
    } else {
      setInstructionList((prev) => [...prev, newInstruction]);
      setInstruction("");
      setInstructionError("");
    }
  };

  const deleteInstructionFromList = (stepNumber: number) => {
    setInstructionList((prev) =>
      prev.filter((insturctionEntry) => insturctionEntry.id !== stepNumber)
    );
    reOrderInstructionsList();
  };

  const setEditingInstruction = async (instruction: instructionSchema) => {
    addInstructionToList(
      {
        id: instruction.id,
        instruction: instruction.instruction,
      },
      true
    );
  };

  const getInstructionPos = (id: number) => {
    return instructionList.findIndex((instruction) => instruction.id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const originalPos = getInstructionPos(Number(active.id));
    const newPos = getInstructionPos(Number(over.id));
    setInstructionList((instructionList) => {
      reOrderInstructionsList();
      return arrayMove(instructionList, originalPos, newPos);
    });
  };

  const reOrderInstructionsList = () => {
    setInstructionList((currentList) =>
      currentList.map((instruction, index) => ({
        ...instruction,
        id: index + 1,
      }))
    );
  };

  const { mutate, data, isPending, error } = useCreateNewPost({
    onError(error, variables, context) {
      toast.error("Something went wrong!");
    },
  });

  const handleSubmit = useCallback(
    (values: z.infer<typeof createNewPostSchema>) => {
      mutate(values);
      form.reset();
      setInstructionList([]);
      setIngredientsList([]);
      toast.message("Succesfully posted! ");
    },
    [mutate]
  );

  /**
   * Disable the form when the request is pending
   */
  useEffect(() => {
    setIsDisabled(isPending);
  }, [isPending]);

  //TODO: remove
  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <Card>
            <CardHeader>
              <CardTitle>Post your dish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                disabled={isDisabled}
                control={form.control}
                name="recipe.title"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Post Header</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Title"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={isDisabled}
                control={form.control}
                name="recipe.description"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Post description</FormLabel>
                    {error && (
                      <FormMessage className="text-red-500">
                        {" "}
                        {error.message}{" "}
                      </FormMessage>
                    )}
                    <FormControl>
                      <Textarea
                        placeholder="Enter Description"
                        className="resize-none field-sizing-content"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={isDisabled}
                control={form.control}
                name="images"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    {error && (
                      <FormMessage className="text-red-500">
                        {" "}
                        {error.message}{" "}
                      </FormMessage>
                    )}
                    <FormDescription>
                      Add images to make your post more appealing.
                    </FormDescription>
                    <FormControl>
                      <ImageSection
                        images={field.value}
                        onValueChange={(files) =>
                          files && form.setValue("images", files)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={isDisabled}
                control={form.control}
                name="recipe.tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormDescription>
                      Add tags to help others find your recipe.
                    </FormDescription>
                    <FormControl>
                      <TagsInput
                        tags={field.value}
                        onTagsChange={(tags) =>
                          form.setValue("recipe.tags", tags)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={isDisabled}
                control={form.control}
                name="recipe.ingredients"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    {error && (
                      <FormMessage className="text-red-500">
                        {" "}
                        {error.message}{" "}
                      </FormMessage>
                    )}
                    <FormDescription>
                      Add the ingredients needed to make your dish.
                    </FormDescription>

                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <IngredientSelector
                          ingredientsList={ingredientsList}
                          editingIngredient={editingIngredient}
                          onSave={(updatedIngredient, isEditing) => {
                            if (isEditing) {
                              setIngredientsList((prev) =>
                                prev.map((ing) =>
                                  ing.ingredient_id ===
                                  updatedIngredient.ingredient_id
                                    ? updatedIngredient
                                    : ing
                                )
                              );
                            } else {
                              setIngredientsList((prev) => [
                                ...prev,
                                updatedIngredient,
                              ]);
                            }
                            setEditingIngredient(null);
                          }}
                          setError={setIngredientError}
                          setEditingIngredient={setEditingIngredient}
                          deleteIngredientFromList={deleteIngredientFromList}
                        ></IngredientSelector>
                        <span className="text-red-600 text-sm">
                          {ingredientError}
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
              >
                <FormField
                  disabled={isDisabled}
                  control={form.control}
                  name="recipe.instructions"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      {error && (
                        <FormMessage className="text-red-500">
                          {" "}
                          {error.message}{" "}
                        </FormMessage>
                      )}
                      <FormDescription>
                        Let others know how they can recreate your dish
                      </FormDescription>
                      <InstructionListComponent
                        instructions={instructionList}
                        deleteInstructionFromList={deleteInstructionFromList}
                        setEditingInstruction={setEditingInstruction}
                      ></InstructionListComponent>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          <InstructionInput
                            instruction={instruction}
                            instructionList={instructionList}
                            addInstructionToList={addInstructionToList}
                            setInstruction={setInstruction}
                          />
                          <span className="text-red-600 text-sm">
                            {instructionError}
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </DndContext>
              <Button
                type="submit"
                disabled={isDisabled}
                onClick={formatCustomFields}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
