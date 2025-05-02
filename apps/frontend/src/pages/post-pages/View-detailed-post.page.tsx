import { PostProvider } from "@/contexts/post.context";
import { usePost } from "@/contexts/post.context";
import { is404Error } from "@/lib/network";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PostView } from "@/components/post/view/post-whole";

/**
 * A component to view a post in detail.
 * It fetches the post data using the postId and displays it in a structured layout.
 */
function Page({ postId }: { postId: string }) {
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

  return <PostView />;
}

export default function ViewVerbosePostPage() {
  const { postId } = useParams();

  if (!postId) {
    throw new Error("postId is required");
  }

  return (
    <PostProvider>
      <Page postId={postId} />
    </PostProvider>
  );
}
