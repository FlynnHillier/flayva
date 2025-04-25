import { zfd } from "zod-form-data";

// ## File validation

type FileOptions<T extends string> = {
  size: number;
  type: T[];
};

const RECOGNISED_IMAGE_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/*",
] as const;

type ImageFileOptions = FileOptions<
  (typeof RECOGNISED_IMAGE_FILE_TYPES)[number]
> & {};

const defaultImageFileOptions: ImageFileOptions = {
  size: 1024 * 1024 * 5, // 5MB
  type: [...RECOGNISED_IMAGE_FILE_TYPES],
} as const;

export const customImageFile = (opts: Partial<ImageFileOptions> = {}) => {
  const allowedTypes = opts.type ?? RECOGNISED_IMAGE_FILE_TYPES;
  const maxSize = opts.size ?? defaultImageFileOptions.size;

  return zfd
    .file()
    .refine(
      ({ type }) =>
        allowedTypes.includes(type as ImageFileOptions["type"][number]),
      {
        message: `File type must be one of: ${allowedTypes.join(", ")}`,
      }
    )
    .refine(({ size }) => size <= maxSize, {
      message: `File size must not exceed ${maxSize / (1024 * 1024)} MB`,
    });
};
