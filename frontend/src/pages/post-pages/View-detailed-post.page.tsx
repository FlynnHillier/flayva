import { PostProvider } from "@/contexts/post.context";
import { usePost } from "@/contexts/post.context";
import { is404Error } from "@/lib/network";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PostHeader } from "@/components/post/view/post-header";
import { PostBody } from "@/components/post/view/post-body";
import { PostSidebar } from "@/components/post/view/post-sidebar";

/**
 * A component to view a post in detail.
 * It fetches the post data using the postId and displays it in a structured layout.
 */
function ViewPost({ postId }: { postId: string }) {
  const navigate = useNavigate();
  const { post, isLoading, error, fetchPost } = usePost();

  useEffect(() => {
    if (postId) fetchPost(postId);
  }, [postId]);

  useEffect(() => {
    if (error) {
      if (is404Error(error)) toast.error("Post not found!");
      else {
        toast.error("Unable to fetch post");
        console.error("Unexpected error fetching post:", error);
      }

      navigate("/post-not-found", { replace: true });
    }
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white  rounded-lg">
      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2">
          <PostHeader />
          <PostBody />
        </div>

        {/* Right Column: Ingredients & Instructions */}
        <PostSidebar className="lg:border-l-1 lg:pl-3 " />
      </div>
    </div>
  );
}

export default function ViewVerbosePostPage() {
  const { postId } = useParams();

  if (!postId) {
    throw new Error("postId is required");
  }

  return (
    <PostProvider>
      <ViewPost postId={postId} />
    </PostProvider>
  );
}
