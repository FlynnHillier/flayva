import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type DropzoneOptions } from "react-dropzone";
import { FileUploader, FileInput } from "@/components/ui/file-upload";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Trash2, CloudUpload, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

type ImageUploadContext = {
  images: File[];
  setImages: (files: File[]) => void;
  imagePreviewUrls: string[];
};

type ImageUploadProviderProps = { children?: ReactNode } & Pick<
  ImageUploadContext,
  "images" | "setImages"
>;

/**
 * A context that provides the image upload state and functions to manage it.
 */
export const ImageUploadContext = React.createContext<ImageUploadContext>({
  images: [],
  setImages: () => {},
  imagePreviewUrls: [],
});

/**
 * A provider component that wraps the image upload context.
 */
const ImageUploadProvider = ({
  children,
  images,
  setImages,
}: ImageUploadProviderProps) => {
  const imagePreviewUrls = useMemo(() => {
    if (!images) return [];
    return images.map((image) => URL.createObjectURL(image));
  }, [images]);

  //cleanup effect
  useEffect(() => {
    return () => {
      if (imagePreviewUrls) {
        imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      }
    };
  }, [imagePreviewUrls]);

  return (
    <ImageUploadContext.Provider
      value={{ images, setImages, imagePreviewUrls }}
    >
      {children}
    </ImageUploadContext.Provider>
  );
};

const useImageUpload = () => useContext(ImageUploadContext);

/**
 * A component that allows the user to upload images.
 */
const FileUploadImagePlaceholder = ({
  className,
}: {
  className?: ClassNameValue;
}) => {
  const { images, setImages } = useImageUpload();

  /**
   * Dropzone configuration
   */
  const DROPZONE_CONFIG: DropzoneOptions = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  };

  return (
    <FileUploader
      value={images}
      onValueChange={(files) => files && setImages(files)}
      dropzoneOptions={DROPZONE_CONFIG}
      className={cn("w-full h-full p-0.5 aspect-square", className)}
    >
      <FileInput className="w-full h-full overflow-hidden flex flex-col items-center justify-center border-dashed border-2">
        <div className="w-full h-full rounded-xl flex flex-col gap-2 items-center justify-center">
          <ImagePlus className="text-gray-500 w-10 h-10" />
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
          </p>
        </div>
      </FileInput>
    </FileUploader>
  );
};

const DeleteButton = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: ClassNameValue;
}) => {
  return (
    <button type="button" onClick={onClick}>
      <Trash2
        className={cn(
          "bg-background/80 rounded-full p-1 hover:stroke-destructive cursor-pointer",
          className
        )}
      />
    </button>
  );
};

/**
 * A component that displays a preview of the uploaded images in a carousel.
 * It also allows the user to delete images from the carousel.
 */
const CarouselImagePreview = ({ className }: { className?: string }) => {
  const { imagePreviewUrls, setImages, images } = useImageUpload();

  const [api, setApi] = useState<CarouselApi>();

  const handleDeleteImage = useCallback(
    (index: number) => {
      setImages(images.filter((_, i) => i !== index));
    },
    [setImages]
  );

  //TODO: add buttons to navigate the carousel
  return (
    <Carousel
      className={cn(
        "w-full h-full relative rounded-xl overflow-hidden ",
        className
      )}
      setApi={setApi}
    >
      <CarouselContent className=" h-full">
        {imagePreviewUrls.map((imageSrc, index) => (
          <CarouselItem
            key={index}
            className="relative  w-full h-full overflow-hidden rounded-xl"
          >
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src={imageSrc}
                alt={"image"}
                className="min-w-full min-h-full object-cover rounded-lg"
              />
            </div>
            {/* right-2 top-2 size-8 */}
            <DeleteButton
              onClick={() => handleDeleteImage(index)}
              className="right-2 top-2 size-8 absolute "
            />
          </CarouselItem>
        ))}
        <CarouselItem>
          <FileUploadImagePlaceholder />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};

/**
 * A component that displays a grid of image previews.
 * It also allows the user to upload more images.
 * The last item in the grid is a placeholder for uploading more images.
 */
const ImagePreviewGrid = ({ className }: { className: ClassNameValue }) => {
  const { imagePreviewUrls, setImages, images } = useImageUpload();

  const handleDeleteImage = useCallback(
    (index: number) => {
      setImages(images.filter((_, i) => i !== index));
    },
    [setImages]
  );

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-2 w-full h-full place-items-center ",
        className
      )}
    >
      {imagePreviewUrls.map((imageSrc, index) => (
        <div
          key={index}
          className="relative w-full aspect-square overflow-hidden"
        >
          <img
            src={imageSrc}
            alt={"image"}
            className="min-w-full min-h-full object-cover rounded-lg"
          />
          <DeleteButton
            onClick={() => handleDeleteImage(index)}
            className="top-2 right-2 size-6 absolute"
          />
        </div>
      ))}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <FileUploadImagePlaceholder />
      </div>
    </div>
  );
};

/**
 * Handles image file uploads
 */
export function ImageUploadAndPreview({
  setImages,
  images,
}: {
  setImages: (files: File[]) => void;
  images: File[];
}) {
  return (
    <ImageUploadProvider images={images} setImages={setImages}>
      <CarouselImagePreview className="w-full aspect-square md:hidden" />
      <ImagePreviewGrid className="hidden md:grid" />
    </ImageUploadProvider>
  );
}
