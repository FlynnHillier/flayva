import { useAddRecipeRating } from "@/hooks/recipe.hooks";
import { RECIPE } from "@flayva-monorepo/shared/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PostRating } from "../view/post-interactions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RecipeRatingPhrase = ({ rating }: { rating: number }) => {
  switch (rating) {
    case 1:
      return "Terrible, not worth making again.";
    case 2:
      return "Underwhelming, didn’t impress.";
    case 3:
      return "Okay, nothing memorable.";
    case 4:
      return "Great, would make again!";
    case 5:
      return "Outstanding, a new favorite!";
    default:
      return "Select a rating";
  }
};

export const AddRecipeRatingForm = ({
  recipeId,
}: {
  recipeId: string | undefined;
}) => {
  if (!recipeId) return null; //TODO: loading view
  const { mutate: addRecipeRating, isPending } = useAddRecipeRating(recipeId)({
    onError: (error) => {
      console.error("Error adding recipe rating:", error);
      toast.error("Failed to add recipe rating");
    },
  });
  const form = useForm<z.infer<typeof RECIPE.createNewRatingSchema>>({
    resolver: zodResolver(RECIPE.createNewRatingSchema),
    defaultValues: {
      rating: 0,
      review: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => addRecipeRating(data))}
        className="flex flex-col items-center flex-nowrap w-xl"
      >
        <h2 className="text-2xl font-semibold">Cooked this?</h2>
        <h1 className="text-3xl font-semibold">Leave a review!</h1>
        <div className="flex flex-col items-center gap-y-4 w-full mt-2">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <div className="flex flex-col items-center gap-y-1">
                <h3 className="text-xl font-semibold">
                  <RecipeRatingPhrase rating={field.value} />
                </h3>
                <PostRating
                  rating={field.value}
                  interactive={true}
                  onInteract={(rating) => {
                    field.onChange(rating);
                  }}
                />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="review"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>Tell us more?</FormLabel>
                {error && (
                  <FormMessage className="text-red-500">
                    {error.message}
                  </FormMessage>
                )}
                <FormControl>
                  <Textarea
                    placeholder="A delicious and easy to make spaghetti bolognaise recipe"
                    className="resize-none field-sizing-content w-96"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            disabled={isPending || !form.formState.isValid}
            type="submit"
            className={cn("self-end", {
              "pointer-events-none": isPending,
              "hover:cursor-pointer": !isPending && form.formState.isValid,
            })}
          >
            {isPending ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
