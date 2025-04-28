import {
  ingredient,
  ingredientReference,
  tag,
} from "@validation/recipe.validation";
import { z } from "zod";

export {
  type RecipeRating,
  type RecipeIngredientItem,
  type RecipeIngredientEntry,
  type RecipeIngredientReference,
  type RecipeIngredientUnit,
  type RecipeTag
}

type RecipeRating = {
  id: string;
  recipe_id: string;
  rating: number;
  review: string | null;
  date: Date;
  user: {
    id: string;
    username: string;
    profile_picture_url: string | null;
    bio: string | null;
  };
  recipe: {
    post: {
      id: string;
    };
  };
};

type RecipeIngredientItem = {
  id: string;
  name: string;
  group: string | null;
  subgroup: string | null;
};


type RecipeTag = {
  id: number;
  name: string;
  category: string;
  emoji: string;
};


type RecipeIngredientEntry = {
  amount_fractional_denominator: number | null;
  amount_fractional_numerator: number | null;
  amount_whole: number | null;
  unit: RecipeIngredientUnit;
  ingredientItem: RecipeIngredientReference;
};


type RecipeIngredientReference = {
  id: string;
  name: string;
  group: string | null;
  subgroup: string | null;
};


type RecipeIngredientUnit = string | null;

