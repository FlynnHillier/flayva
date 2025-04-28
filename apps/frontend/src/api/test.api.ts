import { request } from "@/lib/network";
import { devFileUploadSchema } from "@flayva-monorepo/shared/validation";
import { z } from "zod";

export const fileupload = async (data: z.infer<typeof devFileUploadSchema>) => {
  const formData = new FormData();
  formData.append("text", data.text);
  data.files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await request({
    url: "/api/t/fileupload",
    method: "POST",
    data: formData,
  });

  return res.data;
};
