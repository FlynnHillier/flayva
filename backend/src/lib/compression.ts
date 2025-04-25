import sharp from "sharp";

/**
 * Compress images to webp format and resize them
 *
 * @param images - The images to compress
 * @param options - The options for sharp resize
 * @returns The compressed images as an array of File objects
 */
export async function imageCompression(
  images: File[],
  options: Partial<sharp.ResizeOptions> = {}
): Promise<File[]> {
  const compressedImages = await Promise.all(
    images.map(async (image) => {
      const imageArrayBuffer = await image.arrayBuffer();
      const outputBuffer = await sharp(imageArrayBuffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
          ...options,
        })
        .webp({
          quality: 80,
        })
        .toBuffer();
      const newFileName = image.name.replace(/\.[^/.]+$/, ".webp");
      return new File([outputBuffer], newFileName, {
        type: "image/webp",
      });
    })
  );

  return compressedImages;
}
