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
import { POST as POST_VALIDATION } from "@flayva-monorepo/shared/validation";
import { POST as POST_CONSTANTS } from "@flayva-monorepo/shared/constants";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { TagsInput } from "../recipe/create/recipe-tags-input";
import { useCreateNewPost } from "@/hooks/post.hooks";

const { createNewPostSchema } = POST_VALIDATION;

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
      <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500">
        <div className="flex items-center justify-center flex-col p-8 w-full ">
          <CloudUpload className="text-gray-500 w-10 h-10" />
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
            &nbsp; or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
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
        // TODO: remove these default values
        title: "Spaghetti Bolognaise",
        description: "A delicious and easy to make spaghetti bolognaise recipe",
        //TODO : these values are hard coded until components are created to handle them
        ingredients: [
          {
            id: 10,
            unit: "g",
            amount: {
              whole: 1,
              fractional: {
                denominator: 2,
                numerator: 1,
              },
            },
          },
          {
            id: 116,
            unit: "tbsp",
            amount: {
              whole: 3,
            },
          },
        ],
        instructions: [
          {
            instruction: "Preheat the oven to 180 degrees",
          },
          {
            instruction: "Mix the flour and eggs in a bowl",
          },
        ],
      },
    },
  });

  const { mutate, data, isPending, error } = useCreateNewPost({
    onError(error, variables, context) {
      toast.error("Something went wrong!");
    },
  });

  const handleSubmit = useCallback(
    (values: z.infer<typeof createNewPostSchema>) => mutate(values),
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
                        placeholder="Spaghetti Bolognaise"
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
                    {error && <FormMessage className="text-red-500"> {error.message} </FormMessage>}
                    <FormControl>
                      <Textarea
                        placeholder="A delicious and easy to make spaghetti bolognaise recipe"
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
                    {error && <FormMessage className="text-red-500"> {error.message} </FormMessage>}
                    <FormDescription>Add images to make your post more appealing.</FormDescription>
                    <FormControl>
                      <ImageSection
                        images={field.value}
                        onValueChange={(files) => files && form.setValue("images", files)}
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
                    <FormDescription>Add tags to help others find your recipe.</FormDescription>
                    <FormControl>
                      <TagsInput
                        tags={field.value}
                        onTagsChange={(tags) => form.setValue("recipe.tags", tags)}
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
                    {error && <FormMessage className="text-red-500"> {error.message} </FormMessage>}
                    <FormDescription>Add the ingredients needed to make your dish.</FormDescription>
                    <FormControl>
                      <Input
                        value={field.value.map((ingredient) => ingredient.id).join(", ")}
                        placeholder="1 cup of flour, 2 eggs, 1 cup of milk"
                        className="resize-none field-sizing-content"
                        disabled={true}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={isDisabled}
                control={form.control}
                name="recipe.instructions"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    {error && <FormMessage className="text-red-500"> {error.message} </FormMessage>}
                    <FormDescription>
                      Let others know how they can recreate your dish
                    </FormDescription>
                    <FormControl>
                      <Input
                        value={field.value.map((ingredient) => ingredient.instruction).join(", ")}
                        placeholder="1 cup of flour, 2 eggs, 1 cup of milk"
                        className="resize-none field-sizing-content"
                        disabled={true}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isDisabled}>
                Submit
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
