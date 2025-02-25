import { DefaultHandlers, Suvidha } from "suvidha";

/**
 * Create a new instance of Suvidha
 *
 * Used to maintain typesafety throughout chaining of middlewares and handlers in the application.
 * Sits on top of express.
 */
export const suvidha = (): Suvidha => Suvidha.create(new DefaultHandlers());
