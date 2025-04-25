CREATE TYPE "public"."provider" AS ENUM('google');--> statement-breakpoint
CREATE TYPE "public"."ingredient_group" AS ENUM('Herbs and Spices', 'Vegetables', 'Fruits', 'Nuts', 'Cereals and cereal products', 'Pulses', 'Teas', 'Gourds', 'Coffee and coffee products', 'Soy', 'Cocoa and cocoa products', 'Beverages', 'Aquatic foods', 'Animal foods', 'Milk and milk products', 'Eggs', 'Confectioneries', 'Baking goods', 'Snack foods', 'Baby foods', 'Fats and oils', 'Herbs and spices');--> statement-breakpoint
CREATE TYPE "public"."ingredient_subgroup" AS ENUM('Herbs', 'Cabbages', 'Tropical fruits', 'Onion-family vegetables', 'Nuts', 'Spices', 'Root vegetables', 'Shoot vegetables', 'Cereals', 'Leaf vegetables', 'Oilseed crops', 'Peas', 'Teas', 'Fruit vegetables', 'Gourds', 'Citrus', 'Coffee', 'Pomes', 'Berries', 'Other fruits', 'Soy', 'Tubers', 'Lentils', 'Other pulses', 'Beans', 'Drupes', 'Stalk vegetables', 'Cocoa', 'Fermented beverages', 'Other breads', 'Cereal products', 'Soy products', 'Doughs', 'Distilled beverages', 'Fortified wines', 'Alcoholic beverages', 'Mollusks', 'Seaweed', 'Crustaceans', 'Fishes', 'Cetaceans', 'Bovines', 'Swine', 'Other seeds', 'Other vegetables', 'Poultry', 'Venison', 'Equines', 'Other aquatic foods', 'Pinnipeds', 'Lagomorphs', 'Ovis', 'Caprae', 'Mushrooms', 'Amphibians', 'Fermented milk products', 'Unfermented milks', 'Eggs', 'Frozen desserts', 'Other confectioneries', 'Candies', 'Seasonings', 'Desserts', 'Snack foods', 'Flat breads', 'Dressings', 'Sauces', 'Other milk products', 'Substitutes', 'Sugars', 'Condiments', 'Baking goods', 'Fruit products', 'Waters', 'Fish products', 'Other beverages', 'Baby foods', 'Vegetable products', 'Animal fats', 'Spreads', 'Herb and spice mixtures', 'Cocoa products', 'Fermented milks', 'Leavened breads', 'Roe', 'Nutritional beverages', 'Milk desserts', 'Herbal teas', 'Coffee products', 'Wrappers', 'Vegetable fats', 'Bread products', 'Sweet breads', 'Brassicas', 'Cereals and cereal products', 'Cocoa and cocoa products', 'Coffee and coffee products', 'Milk and milk products', 'Fats and oils', 'Herbs and Spices', 'Pulses', 'Beverages', 'Fruits', 'Green vegetables', '', 'Bivalvia');--> statement-breakpoint
CREATE TYPE "public"."unit" AS ENUM('kg', 'ml', 'g', 'l', 'tbsp', 'tsp', 'cup', 'pinch', 'dash', 'whole');--> statement-breakpoint
CREATE TABLE "account_connections" (
	"user_id" varchar NOT NULL,
	"provider" "provider" NOT NULL,
	"email" text,
	"provider_account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "account_connections_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"profile_picture_url" text,
	"bio" text DEFAULT 'Here for the flayva!' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "post_comments" (
	"id" varchar PRIMARY KEY NOT NULL,
	"comment" varchar NOT NULL,
	"post_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"commented_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "post_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" varchar NOT NULL,
	"key" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_likes" (
	"post_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"liked_at" timestamp DEFAULT now(),
	CONSTRAINT "post_likes_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"owner_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"recipe_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingredients_items" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"group" "ingredient_group" NOT NULL,
	"subgroup" "ingredient_subgroup" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"recipe_id" varchar NOT NULL,
	"ingredient_id" integer NOT NULL,
	"amount_whole" integer NOT NULL,
	"amount_fractional_numerator" integer DEFAULT 1 NOT NULL,
	"amount_fractional_denominator" integer DEFAULT 1 NOT NULL,
	"unit" "unit" NOT NULL,
	CONSTRAINT "recipe_ingredients_ingredient_id_recipe_id_pk" PRIMARY KEY("ingredient_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_instruction_steps" (
	"recipe_id" varchar NOT NULL,
	"step_number" integer NOT NULL,
	"instruction" varchar NOT NULL,
	CONSTRAINT "recipe_instruction_steps_recipe_id_step_number_pk" PRIMARY KEY("recipe_id","step_number")
);
--> statement-breakpoint
CREATE TABLE "recipe_meta_infos" (
	"estimated_cook_time" varchar,
	"estimated_prep_time" varchar,
	"servings" integer,
	"recipe_id" varchar PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_ratings" (
	"id" varchar PRIMARY KEY NOT NULL,
	"recipe_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"rating" integer NOT NULL,
	"review" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipe_tags" (
	"recipe_id" varchar NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "recipe_tags_recipe_id_tag_id_pk" PRIMARY KEY("recipe_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"emoji" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sid" text PRIMARY KEY NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "followers" (
	"followed_id" varchar NOT NULL,
	"follower_id" varchar NOT NULL,
	CONSTRAINT "followers_followed_id_follower_id_pk" PRIMARY KEY("followed_id","follower_id")
);
--> statement-breakpoint
ALTER TABLE "account_connections" ADD CONSTRAINT "account_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_images" ADD CONSTRAINT "post_images_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_ingredients_items_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_instruction_steps" ADD CONSTRAINT "recipe_instruction_steps_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_meta_infos" ADD CONSTRAINT "recipe_meta_infos_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ratings" ADD CONSTRAINT "recipe_ratings_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ratings" ADD CONSTRAINT "recipe_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_followed_id_users_id_fk" FOREIGN KEY ("followed_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_provider_account" ON "account_connections" USING btree ("provider","provider_account_id");