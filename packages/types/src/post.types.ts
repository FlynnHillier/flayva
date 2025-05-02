import { POST } from "@flayva/validation";
import z from "zod";

export type CreateNewPostFormSchemaType = z.infer<
  typeof POST.createNewPostFormSchema
>;
