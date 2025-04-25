import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@lib/query";
import { BrowserRouter } from "react-router-dom";
import { PostsProvider } from "./contexts/posts.context.tsx";
import { FeedProvider } from "./components/feed/feed.context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PostsProvider>
        <BrowserRouter>
          <FeedProvider>
            <App />
          </FeedProvider>
        </BrowserRouter>
      </PostsProvider>
    </QueryClientProvider>
  </StrictMode>
);
