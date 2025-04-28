import { db } from "@/db";

type Table = keyof (typeof db)["query"];

/**
 * Type for the conditions that can be passed to the `findFirst` method of a table.
 */
export type DbFindFirstParams<T extends Table> = Exclude<
  Parameters<(typeof db)["query"][T]["findFirst"]>[0],
  undefined
>;

/**
 * Type for the conditions that can be passed to the `findMany` method of a table.
 */
export type DbFindManyParams<T extends Table> = Exclude<
  Parameters<(typeof db)["query"][T]["findMany"]>[0],
  undefined
>;

export type DbQueryWith<T extends Table> = Required<DbFindFirstParams<T>>["with"];

export type DbQueryWhere<T extends Table> = Required<DbFindManyParams<T>>["where"];

export type DbQueryColumns<T extends Table> = Required<DbFindFirstParams<T>>["columns"];
