import { z } from "zod";

import { validateRequestBody } from "zod-express-middleware";
import { multerupload } from "@/lib/multer";

import { NextFunction, Response, Request, RequestHandler, Router } from "express";
import { devErrorMessage } from "@/lib/utils";
import { MulterError } from "multer";

type MulterFileParseOptions<S extends string> = { key: S; maxCount?: number; single?: boolean };

/**
 * A wrapper around multer's file reading middleware that handles errors
 *
 * @param files configuration for the files to be read from the request
 * @returns
 */
export function readRequestFiles(files: MulterFileParseOptions<string>[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    multerupload.fields(files.map((fileoption) => ({ ...fileoption, name: fileoption.key })))(
      req,
      res,
      (err) => {
        if (!(err instanceof MulterError)) {
          next(err);
          return;
        }

        // TODO: handle other MulterErrors
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            res.status(400).send({ message: `'${err.field}' file is too large`, field: err.field });
            break;
          case "LIMIT_UNEXPECTED_FILE":
            res
              .status(400)
              .send({ message: `'${err.field}' received unexpected file`, field: err.field });
            break;
          case "LIMIT_FILE_COUNT":
            res
              .status(400)
              .send({ message: `'${err.field}' received too many files`, field: err.field });
            break;
          default:
        }
      }
    );
  };
}

/**
 * attach files read by multer to the request body
 *
 * @param files configuration for the files to be read from the request
 * @returns
 */
export function attachFilesToRequestBody(files: MulterFileParseOptions<string>[]) {
  const attach = (req: Request, res: Response, next: NextFunction) => {
    const multerfiles: Record<string, Express.Multer.File[]> = (req as any).files;

    if (!multerfiles) {
      res.status(500).send(devErrorMessage("req.files is undefined, expected files to be present"));
      return;
    }

    // Construct an object that maps the specified file keys to an object with matching keys with values as an array of native File objects
    const nativeFiles = Object.entries(multerfiles).reduce((acc, [key, value]) => {
      acc[key] = value.map(
        (multerFile) =>
          new File([multerFile.buffer], multerFile.originalname, { type: multerFile.mimetype })
      );

      if (files.find((file) => file.key === key)?.single) {
        // If the file is a single file, convert the array to a single object
        acc[key] = acc[key][0];
      }

      return acc;
    }, {} as Record<string, File[] | File>);

    // Add the native file objects to the request body
    req.body = {
      ...req.body,
      ...nativeFiles,
    };
    next();
  };

  return Router().use([readRequestFiles(files), attach]);
}

/**
 * Parse the request body into JSON for the specified keys
 *
 * @param keys The keys in the request body to parse into JSON
 * @returns
 */
export function formatBodyKeysToJson<T extends Record<string, any>>(keys: (keyof T)[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Parse the specified keys in the request body into JSON
    keys.forEach((key) => {
      if (req.body[key]) {
        try {
          req.body[key] = JSON.parse(req.body[key]);
        } catch (e) {
          if (e instanceof SyntaxError) {
            // Do nothing if the key is not a valid JSON string
          } else throw e; // Rethrow the error if it is not a SyntaxError
        }
      }
    });

    next();
  };
}

/**
 * Validate & parse multipart form data with zod schemas
 *
 * @param schema the zod schema to validate the request body against
 * @param options parse options for the request body
 * @param options.files configuration for the files to be read from the request
 * @param options.json keys in the request body to parse into JSON
 */
export function validateMultiPartFormData<S extends z.ZodType>(
  schema: S,
  options: Partial<{
    files: MulterFileParseOptions<Extract<keyof z.infer<S>, string>>[];
    json: Extract<keyof z.infer<S>, string>[];
  }> = {}
) {
  const { files, json } = options;

  return Router().use([
    files ? attachFilesToRequestBody(files) : multerupload.none(), // Read the multipart form data into body
    ...(json ? [formatBodyKeysToJson(json)] : []), // convert
    (req: Request, res: Response, next: NextFunction) => {
      next();
    },
    validateRequestBody(schema), // Validate the request body against the schema
  ]);
}
