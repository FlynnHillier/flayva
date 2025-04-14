import { useEffect, useMemo, useState } from "react";
import { type DropzoneOptions } from "react-dropzone";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
} from "@/components/ui/file-upload";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SlideshowItem } from "@/components/Slideshow";
import { Trash2, CloudUpload } from "lucide-react";

/**
 * Handles image file uploads
 */
export function ImageUploadAndPreview({
  onValueChange,
  images,
}: {
  onValueChange: (files: File[] | null) => void;
  images: File[];
}) {
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

  const imagePreviews = useMemo<string[] | undefined>(() => {
    if (!images) return undefined;
    return images.map((image) => URL.createObjectURL(image));
  }, [images]);

  //cleanup effect
  useEffect(() => {
    return () => {
      if (imagePreviews) {
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      }
    };
  }, [imagePreviews]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log(currentIndex);
  }, [currentIndex]);

  // TODO: change this to show a preview of the uploaded images instead of just the name
  return (
    <div>
      <FileUploader
        value={images}
        onValueChange={onValueChange}
        dropzoneOptions={DROPZONE_CONFIG}
        className="relative bg-background rounded-lg p-2"
      >
        <div className="hidden md:block">
          <div className="flex flex-col gap-3">
            <FileInput
              id="fileInput"
              className="outline-dashed outline-1 outline-slate-500"
            >
              <div className="flex items-center justify-center flex-col p-8 w-full ">
                <CloudUpload className="text-gray-500 w-10 h-10" />
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span>
                  &nbsp; or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF
                </p>
              </div>
            </FileInput>
            <div className="flex flex-row gap-3 ">
              {imagePreviews?.map((i, index) => (
                <div className="relative w-fit rounded-2xl ">
                  <div className="size-64 overflow-hidden">
                    <img
                      src={i}
                      alt={"image"}
                      className="h-full w-full object-cover rounded-2xl"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const newFiles = images.filter(
                        (_, imgIndex) => imgIndex !== index
                      );
                      onValueChange(newFiles);
                      setCurrentIndex(currentIndex - 1);
                    }}
                  >
                    {" "}
                    <Trash2 className="absolute top-2 right-2 w-4 h-4 hover:cursor-pointer hover:stroke-destructive duration-200 ease-in-out" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="block md:hidden">
          {imagePreviews && imagePreviews.length < 1 ? (
            <FileInput
              id="fileInput"
              className="outline-dashed outline-1 outline-slate-500"
            >
              <div className="relative w-full aspect-square mx-auto max-w-4xl">
                <div className="w-full h-full rounded-xl overflow-hidden bg-background/80 flex items-center justify-center">
                  {" "}
                  <div className="flex flex-col gap-3 items-center">
                    <CloudUpload className="text-gray-500 w-10 h-10" />
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                  </div>
                </div>
              </div>
            </FileInput>
          ) : (
            <div>
              <div className="relative w-full aspect-square mx-auto max-w-4xl">
                {imagePreviews ? (
                  <div className="w-full h-full rounded-xl overflow-hidden">
                    <Carousel className="w-full h-full relative">
                      <CarouselContent>
                        {imagePreviews.map((imageSrc, index) => (
                          <CarouselItem key={index} className="relative">
                            <div className="relative w-full h-full">
                              <img
                                src={imageSrc}
                                alt={"image"}
                                className="h-full w-full object-cover rounded-xl"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                        <CarouselItem>
                          <FileInput id="fileInput" className="">
                            <div className="relative w-full aspect-square mx-auto max-w-4xl">
                              <div className="w-full h-full rounded-xl overflow-hidden bg-background/80 flex items-center justify-center">
                                {" "}
                                <div className="flex flex-col gap-3 items-center">
                                  <CloudUpload className="text-gray-500 w-10 h-10" />
                                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">
                                      Click to upload more
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </FileInput>
                        </CarouselItem>
                      </CarouselContent>
                      {currentIndex < imagePreviews.length ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const newFiles = images?.filter(
                              (_, imgIndex) => imgIndex !== currentIndex
                            );
                            onValueChange(newFiles);
                            if (newFiles) {
                              if (currentIndex >= newFiles.length) {
                                const newIndex = Math.max(
                                  newFiles.length - 1,
                                  0
                                );
                                setCurrentIndex(newIndex);
                              }
                            }
                          }}
                        >
                          <Trash2 className="absolute bg-background/80 rounded-full p-1 right-2 top-2 w-6 h-6 hover:stroke-destructive cursor-pointer" />
                        </button>
                      ) : null}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentIndex(currentIndex - 1);
                        }}
                      >
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentIndex(currentIndex + 1);
                        }}
                      >
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                      </button>
                    </Carousel>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </FileUploader>
    </div>
  );
}
