import { z } from "zod";

import { validateRequestBody } from "zod-express-middleware";
import { multerupload } from "@/lib/multer";

import { NextFunction, Response, Request, RequestHandler } from "express";
import { devErrorMessage } from "@/lib/utils";

type MulterFileConfig<S extends string> = { name: S; maxCount?: number };

//TODO: add better error messages for when MulterErrors are thrown

/**
 * attach files read by multer to the request body
 *
 * @param files configuration for the files to be read from the request
 * @returns
 */
export function attachFilesToRequestBody(files: MulterFileConfig<string>[]) {
  return [
    multerupload.fields(files),
    (req: Request, res: Response, next: NextFunction) => {
      const files: Record<string, Express.Multer.File[]> = (req as any).files;

      if (!files) {
        res
          .status(500)
          .send(devErrorMessage("req.files is undefined, expected files to be present"));
        return;
      }

      // Construct an object that maps the specified file keys to an object with matching keys with values as an array of native File objects
      const nativeFiles = Object.entries(files).reduce((acc, [key, value]) => {
        acc[key] = value.map(
          (multerFile) => new File([multerFile.buffer], multerFile.originalname)
        );
        return acc;
      }, {} as Record<string, File[]>);

      // Add the native file objects to the request body
      req.body = {
        ...req.body,
        ...nativeFiles,
      };

      next();
    },
  ];
}

// TODO: potentially type schema better here

/**
 *
 * @param req express request object
 * @param schema zod schema to validate the request body against
 * @param files which keys in the request body are files, and how many files are allowed for each
 * @returns
 */
export function validateRequestBodyWithFiles<T extends z.ZodType>(
  schema: T,
  files: MulterFileConfig<Extract<keyof z.infer<T>, string>>[]
) {
  return [attachFilesToRequestBody(files), validateRequestBody(schema)];
}
