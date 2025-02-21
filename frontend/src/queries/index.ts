import { mergeQueryKeys } from "@lukemorales/query-key-factory";

// Import all queries from the queries folder
import { test } from "./test";

export const queries = mergeQueryKeys(test);
