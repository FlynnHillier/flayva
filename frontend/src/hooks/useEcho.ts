import { api } from "@/api/api";
import { useMutation } from "@tanstack/react-query";

// TODO: Remove this example hook

export function useEcho() {
  return useMutation({
    mutationFn: async (message: string) => await api.test.echo(message),
    mutationKey: ["echo"],
  });
}
