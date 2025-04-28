export { type Post, type PostPreview }

type PostPreview = {
    id: string;
    recipeId: string;
    created_at: string;
    images: {
      key: string;
    }[];
    recipe: {
      id: string;
      title: string;
      description: string;
      tagLinks: {
        tag: {
          id: number;
          name: string;
          category: string;
          emoji: string;
        };
      }[];
    };
    owner: {
      id: string;
      username: string;
      profile_picture_url: string | null;
      bio: string | null;
    };
  };

  type Post = {
    id: string;
    recipeId: string;
    created_at: string;
    owner: {
      [key: string]: unknown;
    };
    images: {
      key: string;
    }[];
    recipe: {
      tagLinks: {
        tag: {
          id: number;
          name: string;
          category: string;
          emoji: string;
        };
      }[];
      instructions: {
        instruction: string;
        stepNumber: number;
      }[];
      ingredients: {
        amount_fractional_denominator: number | null;
        amount_fractional_numerator: number | null;
        amount_whole: number | null;
        unit: string | null;
        ingredientItem: {
          id: string;
          name: string;
          group: string | null;
          subgroup: string | null;
        };
      }[];
      metaInfo: {
        estimatedCookTime: number | null;
        estimatedPrepTime: number | null;
        servings: number | null;
      } | null;
    };
  };
