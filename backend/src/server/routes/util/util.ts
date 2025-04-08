import { assert } from "console";
import { RequestHandler, Router } from "express";

export const createRouter = (
  routes: Record<
    string,
    | Router
    | {
        method: "GET" | "POST" | "PUT" | "DELETE";
        handler: [RequestHandler, ...RequestHandler[]];
      }[]
  >
) => {
  const router = Router();

  Object.entries(routes).forEach(([path, handler]) => {
    if (handler instanceof Router) {
      // If the handler is a Router instance, use it as a sub-router
      router.use(path, handler as Router);
    } else {
      // Otherwise, assume it's an object with method and handler
      assert(
        Array.isArray(handler),
        "Expected handler to be an array of RequestHandlers"
      );

      handler = handler as Exclude<typeof handler, Router>;

      handler.forEach(({ method, handler: requestHandler }) => {
        switch (method) {
          case "GET":
            router.get(path, requestHandler);
            break;
          case "POST":
            router.post(path, requestHandler);
            break;
          case "PUT":
            router.put(path, requestHandler);
            break;
          case "DELETE":
            router.delete(path, requestHandler);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      });
    }
  });

  return router;
};
