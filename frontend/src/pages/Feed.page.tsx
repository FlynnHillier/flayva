import { FeedProvider } from "@/components/feed/feed.context";
import { Feed } from "@/components/feed/Feed";

export default function FeedPage() {
  return (
    <FeedProvider>
      <Feed />
    </FeedProvider>
  );
}
