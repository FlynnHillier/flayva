import recipeServices from "@/server/services/recipe.services";
import { NestedControllerObject } from "@/types/api.types";
import type { RecipeTag, CreateNewRatingFormSchemaType } from "@flayva/types";
import { RequestHandler } from "express";

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
    /**
     * Fetch ratings for a recipe
     */
    delete: {
      me: async (req, res) => {
        const { recipeId } = req.params;

        const deleted =
          await recipeServices.interactions.ratings.delete.byRecipeIdAndUserId(
            recipeId,
            req.user!.id
          );

        if (!deleted) {
          res.status(404).send({ message: "Review does not exist" });
          return;
        }

        res.status(200).send({ message: "Review deleted" });
      },
      byRatingId: async (req, res) => {
        // TODO: make this ensure also respects the recipeId passed in the params

        const { ratingId } = req.params;

        const existing =
          await recipeServices.interactions.ratings.get.single.byRatingId(
            ratingId
          );

        if (!existing) {
          res.status(404).send({ message: "Review does not exist" });
          return;
        }

        if (existing.user.id !== req.user!.id) {
          res
            .status(403)
            .send({ message: "You are not allowed to delete this review" });
          return;
        }

        const deleted =
          await recipeServices.interactions.ratings.delete.byRatingId(ratingId);

        if (!deleted) {
          res.status(404).send({ message: "Review does not exist" });
          return;
        }

        res.status(200).send({ deleted: deleted });
      },
    },

    fetch: {
      /**
       * Fetch a user's own rating for a recipe
       */
      me: async (req, res) => {
        const { recipeId } = req.params;

        const rating =
          await recipeServices.interactions.ratings.get.single.byRecipeIdAndUserId(
            recipeId,
            req.user!.id
          );

        res.status(200).send({
          rating: rating ?? null,
        });
      },
      /**
       * Fetch a rating by recipeId and userId
       */
      byRecipeIdAndUserId: async (req, res) => {
        const { recipeId, userId } = req.params;

        const rating =
          await recipeServices.interactions.ratings.get.single.byRecipeIdAndUserId(
            recipeId,
            userId
          );

        if (!rating) {
          res.status(404).send({ message: "Rating not found" });
          return;
        }

        res.status(200).send(rating);
      },
      /**
       * Fetch a rating by ratingId
       */
      byRatingId: async (req, res) => {
        const { ratingId } = req.params;

        const rating =
          await recipeServices.interactions.ratings.get.single.byRatingId(
            ratingId
          );

        if (!rating) {
          res.status(404).send({ message: "Rating not found" });
          return;
        }

        res.status(200).send(rating);
      },
    },
    /**
     * Add a new rating to a recipe
     */
    add: async (req, res) => {
      const { recipeId } = req.params;
      const { rating, review } = req.body as CreateNewRatingFormSchemaType;

      const existingRating =
        await recipeServices.interactions.ratings.get.single.byRecipeIdAndUserId(
          recipeId,
          req.user!.id
        );

      if (existingRating) {
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
    /**
     * Fetch statistics for a recipe's ratings
     */
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
    /**
     * Fetch ratings for a recipe with pagination
     */
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
