import { z } from "zod";
import { zfd } from "zod-form-data";

export const devFileUploadSchema = zfd.formData({
  text: z.string().nonempty(),
  files: z
    .array(
      zfd.file().refine((file) => file.size < 1024 * 1024 * 5, { message: "File is too large" })
    )
    .min(1),
});
