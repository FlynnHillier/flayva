import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/hooks/auth.hooks";
const formSchema = z.object({
  username: z.string().min(1),
  biography: z.string(),
  profile_picture: z.string(),
});

export default function EditProfile({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const [files, setFiles] = useState<File[] | null>(null);
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  const { data } = useMe();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="relative xl:w-330">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Username" type="" {...field} />
                    </FormControl>
                    <FormDescription className="pb-5">
                      This is your public display name.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your Bio"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="pb-5">
                      You can @mention other users and organizations.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profile_picture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select File</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={files}
                        onValueChange={setFiles}
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
                              <span className="font-semibold">
                                Click to upload
                              </span>
                              &nbsp; or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF
                            </p>
                          </div>
                        </FileInput>
                        <FileUploaderContent>
                          {files &&
                            files.length > 0 &&
                            files.map((file, i) => (
                              <FileUploaderItem key={i} index={i}>
                                <Paperclip className="h-4 w-4 stroke-current" />
                                <span>{file.name}</span>
                              </FileUploaderItem>
                            ))}
                        </FileUploaderContent>
                      </FileUploader>
                    </FormControl>
                    <FormDescription>
                      Select a new profile picture.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
