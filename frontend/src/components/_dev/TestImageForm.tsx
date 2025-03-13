import { zfd } from "zod-form-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { DropzoneOptions } from "react-dropzone";

const formSchema = z.object({
  text: z.string().nonempty(),
  files: z.array(zfd.file().refine((f) => f.size < 1024 * 1024 * 4)).min(1),
});

export default function TestImageForm() {
  const dropZoneConfig: DropzoneOptions = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const handleFileChange = useCallback(
    (files: File[] | null) => {
      files && form.setValue("files", files);
    },
    [form]
  );

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
          <Card>
            <CardContent>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your Bio" className="resize-none" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select File</FormLabel>
                    <FormDescription>Upload an image</FormDescription>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={handleFileChange}
                        dropzoneOptions={dropZoneConfig}
                        className="relative bg-background rounded-lg p-2"
                      >
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
                        <FileUploaderContent>
                          {field.value &&
                            field.value.length > 0 &&
                            field.value.map((file, i) => (
                              <FileUploaderItem key={i} index={i}>
                                <Paperclip className="h-4 w-4 stroke-current" />
                                <span>{file.name}</span>
                              </FileUploaderItem>
                            ))}
                        </FileUploaderContent>
                      </FileUploader>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
