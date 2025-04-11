import { useHash } from "@/hooks/navigation.hooks";
import { useUpdateProfile } from "@/hooks/social.hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { SOCIAL } from "@flayva-monorepo/shared/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FileUploader, FileInput } from "../ui/file-upload";
import { Pencil } from "lucide-react";
import { useMe } from "@/hooks/auth.hooks";
import { ProfilePicture } from "./profile-common";
import { User } from "@flayva-monorepo/shared/types";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

const ConfirmExitDialog = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">Unsaved Changes</DialogTitle>
        <DialogDescription>Are you sure you want to exit? </DialogDescription>
      </DialogHeader>
      <div className="flex w-full justify-center gap-x-2 ">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="outline" onClick={onConfirm}>
          Exit
        </Button>
      </div>
    </>
  );
};

export const EditOwnProfileModal = ({ children }: { children: ReactNode }) => {
  const { hash, setHash, clearHash } = useHash();
  const { data: me } = useMe();

  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false);
  const [isShowingConfirmExit, setIsShowingConfirmExit] = useState(false);

  const closeDialog = useCallback(() => {
    clearHash();
    hideConfirmExitDialog();
  }, [clearHash]);

  const openDialog = useCallback(() => {
    setHash("#edit");
  }, [setHash]);

  const showConfirmExitDialog = useCallback(() => {
    setIsShowingConfirmExit(true);
  }, [setIsShowingConfirmExit]);

  const hideConfirmExitDialog = useCallback(() => {
    setIsShowingConfirmExit(false);
  }, [setIsShowingConfirmExit]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      // Handles the native shadcn dialog open change event
      if (open) {
        openDialog();
      } else if (isUnsavedChanges) {
        showConfirmExitDialog();
      } else closeDialog();
    },
    [isUnsavedChanges, showConfirmExitDialog, closeDialog, openDialog]
  );

  useEffect(() => {
    // If the hash is #edit and the user is not logged in, clear the hash
    if (hash === "#edit" && me && !me.user) {
      clearHash();
    }
  }, [me, hash]);

  return (
    <Dialog onOpenChange={handleOpenChange} open={hash === "#edit"}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn("max-w-2xl w-80 md:w-96 flex flex-col items-center", {
          "[&>button:first-]:hidden": isShowingConfirmExit,
        })}
      >
        {isShowingConfirmExit && (
          <ConfirmExitDialog
            onConfirm={closeDialog}
            onCancel={hideConfirmExitDialog}
          />
        )}
        <DialogHeader className={cn({ hidden: isShowingConfirmExit })}>
          <DialogTitle className="text-center "> Edit Profile </DialogTitle>
        </DialogHeader>
        {/* TODO: add loading state here */}
        {me?.user && (
          <EditProfileForm
            user={me?.user}
            className={cn({ hidden: isShowingConfirmExit })}
            onUnsavedChanges={setIsUnsavedChanges}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export const EditProfilePicture = ({
  user,
  image,
  onImageUpload,
}: {
  user: User;
  image: File | undefined;
  onImageUpload: (image: File | null) => void;
}) => {
  const imagePreview = useMemo<undefined | string>(
    () => image && URL.createObjectURL(image),
    [image]
  );

  const onValueChange = useCallback(
    (files: File[] | null) => onImageUpload(files?.[files?.length - 1] ?? null),
    [onImageUpload]
  );

  return (
    <FileUploader
      value={image ? [image] : []}
      onValueChange={onValueChange}
      // TODO: edit dropzone config
      dropzoneOptions={{
        multiple: false,
        maxFiles: 2,
        accept: {
          "image/jpeg": [],
          "image/png": [],
        },
      }}
      className="max-w-fit max-h-fit p-1"
    >
      <FileInput>
        <div className="w-20 h-20 relative  block overflow-visible">
          <ProfilePicture
            user={{
              ...user,
              profile_picture_url: imagePreview ?? user.profile_picture_url,
            }}
          />
          <Pencil className="absolute bottom-1 right-0 bg-white rounded-full text-gray-500 border-gray-300 border-1 p-0.5" />
        </div>
      </FileInput>
    </FileUploader>
  );
};

export const EditProfileForm = ({
  user,
  className,
  onUnsavedChanges,
}: {
  user: User;
  className?: ClassNameValue;
  onUnsavedChanges?: (isUnsavedChanges: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof SOCIAL.updateProfileFormSchema>>({
    resolver: zodResolver(SOCIAL.updateProfileFormSchema),
    defaultValues: {
      username: user.username,
      bio: user.bio,
      avatar: undefined,
    },
  });

  const { mutate, isPending, error } = useUpdateProfile({
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update profile");
    },
    onSuccess: ({ user: { username, bio } }) => {
      toast.success("Profile updated successfully");
      form.reset({
        avatar: undefined,
        username: username,
        bio: bio,
      });
    },
  });

  const handleSubmit = useCallback(
    form.handleSubmit((data) => {
      // data for some reason will not include the username field
      mutate(form.getValues());
    }),
    [form.handleSubmit, mutate, form]
  );

  const isDisabled = useMemo(() => isPending, [isPending]);

  useEffect(() => {
    onUnsavedChanges?.(form.formState.isDirty);
  }, [form.formState.isDirty]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col space-y-2 items-center w-full min-w-fit",
          className
        )}
      >
        <FormField
          disabled={isDisabled}
          control={form.control}
          name="avatar"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormControl>
                <EditProfilePicture
                  user={user}
                  image={field.value}
                  onImageUpload={(file) =>
                    file && form.setValue("avatar", file)
                  }
                />
              </FormControl>
              {error && (
                <FormMessage className="text-red-500">
                  {" "}
                  {error.message}{" "}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          disabled={isDisabled}
          control={form.control}
          name="username"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>
              {error && (
                <FormMessage className="text-red-500">
                  {" "}
                  {error.message}{" "}
                </FormMessage>
              )}
              <FormControl>
                <Input placeholder="Gordon Ramsay" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          disabled={isDisabled}
          control={form.control}
          name="bio"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full">
              <FormLabel>Bio</FormLabel>
              {error && (
                <FormMessage className="text-red-500">
                  {" "}
                  {error.message}{" "}
                </FormMessage>
              )}
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself!"
                  {...field}
                  className="resize-none contain-content"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="self-end"
          disabled={!form.formState.isDirty || isDisabled}
        >
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
