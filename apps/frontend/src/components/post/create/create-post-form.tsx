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
import { Textarea } from "@/components/ui/textarea";
import { POST } from "@flayva/validation";
import { toast } from "sonner";
import { Input } from "../../ui/input";
import IngredientsHandler from "./ingredients/ingredients";
import { useCreateNewPost } from "@/hooks/post.hooks";
import { ImageUploadAndPreview } from "./image-input";
import {
  InstructionItem,
  InstructionsHandler,
} from "./instructions/instructions";
import { useNavigate } from "react-router-dom";
import { TagSelector } from "@/components/tags/TagSelector";
import { CreateNewPostFormSchemaType, RecipeTag } from "@flayva/types";

export default function CreateNewPostForm() {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const navigate = useNavigate();
  const form = useForm<CreateNewPostFormSchemaType>({
    //@ts-ignore //TODO: remove!
    resolver: zodResolver(POST.createNewPostFormSchema),
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

  // Use state for instructions so we
  const [instructions, setInstructions] = useState<InstructionItem[]>([]);
  useEffect(() => {
    form.setValue(
      "recipe.instructions",
      instructions.map(({ instruction }) => ({
        instruction,
      }))
    );
  }, [instructions, form.setValue]);

  const { mutate, data, isPending, error } = useCreateNewPost({
    onError(error) {
      console.error(error);
      toast.error("Something went wrong!");
    },
    onSuccess({ postId }) {
      toast.success("Post created successfully!");
      navigate(`/p/${postId}`);
    },
  });

  const handleSubmit = useCallback(
    (values: CreateNewPostFormSchemaType) => {
      mutate(values);
    },
    [mutate]
  );

  /**
   * Disable the form when the request is pending
   */
  useEffect(() => {
    setIsDisabled(isPending);
  }, [isPending]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 mx-auto px-4 w-full  overflow-hidden"
      >
        <FormField
          disabled={isDisabled}
          control={form.control}
          name="recipe.title"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Recipe Title</FormLabel>
              <FormControl>
                <Input placeholder="" className="resize-none" {...field} />
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
              <FormLabel>Recipe description</FormLabel>
              {error && (
                <FormMessage className="text-red-500">
                  {error.message}
                </FormMessage>
              )}
              <FormControl>
                <Textarea
                  placeholder=""
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
                  {error.message}
                </FormMessage>
              )}
              <FormDescription>
                Add images to make your post more appealing.
              </FormDescription>
              <FormControl>
                <ImageUploadAndPreview
                  images={field.value}
                  setImages={(images) => form.setValue("images", images)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          disabled={isDisabled}
          control={form.control}
          name="recipe.tags"
          render={({ field, fieldState: { error } }) => {
            // field.value is an array of RecipeTag objects
            const selectedTagIds = field.value.map((tag) => tag.id);

            const handleToggleTag = (tag: RecipeTag) => {
              if (selectedTagIds.includes(tag.id)) {
                const updated = field.value.filter((t) => t.id !== tag.id);
                form.setValue("recipe.tags", updated);
              } else {
                form.setValue("recipe.tags", [...field.value, tag]);
              }
            };

            return (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                {error && (
                  <FormMessage className="text-red-500">
                    {error.message}
                  </FormMessage>
                )}
                <FormDescription>
                  Add tags to help others find your recipe.
                </FormDescription>
                <FormControl>
                  <TagSelector
                    selectedTagIds={selectedTagIds}
                    onToggle={handleToggleTag}
                    categoryTextSize="text-sm"
                  />
                </FormControl>
              </FormItem>
            );
          }}
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
                  {error.message}
                </FormMessage>
              )}
              <FormDescription>
                Add the ingredients needed to make your dish.
              </FormDescription>

              <FormControl>
                <div className="flex flex-col gap-2">
                  <IngredientsHandler
                    ingredients={field.value}
                    updateIngredients={(updatedIngredients) => {
                      form.setValue("recipe.ingredients", updatedIngredients);
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          disabled={isDisabled}
          control={form.control}
          name="recipe.instructions"
          render={({ fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              {error && (
                <FormMessage className="text-red-500">
                  {error.message}
                </FormMessage>
              )}
              <FormDescription>
                Let others know how they can recreate your dish
              </FormDescription>
              <FormControl>
                <InstructionsHandler
                  instructions={instructions}
                  setInstructions={setInstructions}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={"default"}
          size={"lg"}
          disabled={isDisabled}
          className="ml-auto"
        >
          Post
        </Button>
      </form>
    </Form>
  );
}
