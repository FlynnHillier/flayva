import { api } from "@/api/api";
import { useMutation } from "@tanstack/react-query";

export function useTestFileUpload() {
  return useMutation({
    mutationFn: async (...args: Parameters<typeof api.test.fileupload>) =>
      await api.test.fileupload(...args),
    mutationKey: ["test", "fileupload"],
  });
}
