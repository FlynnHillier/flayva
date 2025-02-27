import { mergeQueryKeys } from "@lukemorales/query-key-factory";

// Import all queries from the queries folder
import { test } from "./test";
import { auth } from "@/queries/auth.query";
import { social } from "@/queries/social.query";

export const queries = mergeQueryKeys(test, auth, social);
