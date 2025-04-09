import recipeServices from "@/server/services/recipe.services";
import { NestedControllerObject } from "@/types/api.types";
import { RecipeTag } from "@flayva-monorepo/shared/types";
import { createNewRatingSchema } from "@flayva-monorepo/shared/validation/recipe.validation";
import { RequestHandler } from "express";
import { z } from "zod";

/**
 * Search for tags that are similar to the search term
 */
export const searchSimilarValidRecipeTag: RequestHandler = async (req, res) => {
  const { searchTerm } = req.params;

  if (!searchTerm) {
    res.status(400).send({ message: "search term is required" });
    return;
  }

  const results: RecipeTag[] = await recipeServices.searchSimilarValidRecipeTag(
    searchTerm
  );

  res.status(200).send({
    tags: results,
  });
};

/**
 *
 *
 * INTERACTIONS
 *
 *
 */
export const interactions = {
  ratings: {
    add: async (req, res) => {
      const { recipeId } = req.params;
      const { rating, review } = req.body as z.infer<
        typeof createNewRatingSchema
      >;

      const { exists, rating: existingRating } =
        await recipeServices.interactions.ratings.exists(
          recipeId,
          req.user!.id
        );

      if (exists) {
        res.status(409).send({
          message: "rating already exists",
          ratingId: existingRating?.id,
        });
        return;
      }

      const addedRating = await recipeServices.interactions.ratings.add(
        recipeId,
        req.user!.id,
        {
          rating,
          review,
        }
      );

      if (!addedRating) {
        res.status(500).send({ message: "failed to add rating" });
        return;
      }

      const { id: addedRatingId } = addedRating;

      const formattedAddedRating =
        await recipeServices.interactions.ratings.get.single.byRatingId(
          addedRatingId
        );

      if (!formattedAddedRating) {
        // TODO: this is a bit hacky - we should probably return the added rating instead of fetching it again
        // However, this is a good way to ensure that the rating is formatted universally
        res.status(500).send({ message: "failed to add rating" });
        return;
      }

      res.status(200).send(formattedAddedRating);
    },
    statistics: async (req, res) => {
      const { recipeId } = req.params;

      const statistics =
        await recipeServices.interactions.ratings.statistics.byRecipeId(
          recipeId
        );

      if (!statistics) {
        res.status(404).send({ message: "recipe not found" });
        return;
      }

      res.status(200).send({
        recipeId: recipeId,
        ratings: {
          average: statistics.averageRating,
          count: statistics.ratingCount,
          distribution: statistics.distribution,
        },
      });
    },
    pagination: async (req, res) => {
      const { recipeId } = req.params;
      const { cursor } = req.query as { cursor: string | undefined };

      const parsedCursor = cursor ? parseInt(cursor) : 0;

      const { nextCursor, ratings } =
        await recipeServices.interactions.ratings.get.aggreagate.pagination(
          recipeId,
          parsedCursor
        );

      res.status(200).send({
        nextCursor,
        ratings,
      });
    },
  },
} satisfies NestedControllerObject;

export default {
  interactions,
  searchSimilarValidRecipeTag,
};
