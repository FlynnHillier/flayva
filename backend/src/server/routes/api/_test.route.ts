import { Router, Request, Response } from "express";
import { devFileUploadSchema } from "@flayva-monorepo/shared/validation";
import { validateRequestBodyWithFiles } from "@/server/middleware/validation.middleware";
import { uploadthing } from "@/lib/uploadthing";

const router: Router = Router();

//TODO: delete this route

router.post(
  "/fileupload",
  ...validateRequestBodyWithFiles(devFileUploadSchema, [{ name: "files", maxCount: 2 }]),
  async (req: Request, res: Response) => {
    console.log(req.body);

    const data = await uploadthing.uploadFiles(req.body.files);

    console.log(data);

    res.send(data);
  }
);

export default router;
