import CreateNewPostForm from "@/components/post/create/create-post-form";

export default function CreatePostPage() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto mb-2">
      <h1 className="text-2xl font-bold m-4 mb-2 text-center font-stretch-condensed mt-6">
        Share your recipe!
      </h1>
      <CreateNewPostForm />
    </div>
  );
}
