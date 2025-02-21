import { queries } from "@queries/index";
import { useQuery } from "@tanstack/react-query";

// TODO: Remove this example hook

export function useHello() {
  return useQuery(queries.test.hello());
}
