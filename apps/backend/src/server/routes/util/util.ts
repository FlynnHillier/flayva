import { RequestHandler, Router } from "express";

export const createRouter = (
  routes: Record<
    string,
    {
      handlers: Partial<
        Record<
          "POST" | "GET" | "PUT" | "DELETE",
          [RequestHandler, ...RequestHandler[]]
        >
      >;
      router?: Router;
    }
  >
) => {
  const router = Router({ mergeParams: true });

  Object.entries(routes).forEach(([path, { handlers, router: subRouter }]) => {
    Object.entries(handlers).forEach(([method, handler]) => {
      switch (method) {
        case "GET":
          router.get(path, ...handler);
          break;
        case "POST":
          router.post(path, ...handler);
          break;
        case "PUT":
          router.put(path, ...handler);
          break;
        case "DELETE":
          router.delete(path, ...handler);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    });

    if (subRouter) {
      // If the handler is a Router instance, use it as a sub-router
      router.use(path, subRouter);
    }
  });

  return router;
};
