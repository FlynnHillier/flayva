import { Routes, Route, useLocation } from "react-router-dom";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useMe } from "./hooks/auth.hooks";
import { toast, Toaster } from "sonner";

/* Pages */
import HomePage from "./pages/Home.page";
import AppSidebar from "./components/layout/Sidebar";
import FeedPage from "./pages/Feed.page";
import LoginPage from "./pages/Login.page";
import CreatePostPage from "./pages/Create-post.page";
import RecipePage from "./pages/Recipe.page";
import ViewProfilePage from "./pages/profile-pages/Profile.page";
import ProfileLayout from "@/pages/profile-pages/profile.layout";

import ViewDetailedPostPage from "./pages/post-pages/View-detailed-post.page";
import SearchPage from "./pages/Search.page";
import { OnLoadingErrorView, LoadingView } from "./components/layout/Loading";

/**
 * Routes that should not show the sidebar
 */
const HIDE_SIDEBAR_ROUTES = ["/login"];

/**
 * A router that protects the routes it wraps by checking if the user is authenticated.
 *
 */
function AuthenticatedRouter() {
  const { data, isPending, error, refetch } = useMe();

  if (error)
    toast.error(
      "Failed to verify authentication status! Please try again later."
    );

  if (error)
    return (
      <OnLoadingErrorView
        message={
          <>
            We’re having trouble verifying your access.
            <br /> Please try again later.
          </>
        }
        onRetry={() => refetch()}
      />
    );

  if (isPending) return <LoadingView />; // TODO: better loading view

  if (!data?.authenticated || !data.user) return <Navigate to="/login" />;

  return <Outlet />;
}

/**
 * A router that protects the routes it wraps by checking if the user is unauthenticated.
 *
 */
function UnauthenticatedRouter() {
  const { data, isPending, error, refetch } = useMe();

  useEffect(() => {
    if (error)
      toast.error(
        "Failed to verify authentication status! Please try again later."
      );
  }, [error]);

  if (error)
    return (
      <OnLoadingErrorView
        message={
          <>
            We’re having trouble verifying your access.
            <br /> Please try again later.
          </>
        }
        onRetry={() => refetch()}
      />
    );

  if (isPending) return <LoadingView />; // TODO: better loading view

  if (data?.authenticated || data?.user) return <Navigate to="/feed" />;

  return <Outlet />;
}

/**
 * The main application component.
 */
function App() {
  const { pathname } = useLocation();

  const shouldShowSidebar = useMemo(
    () => !HIDE_SIDEBAR_ROUTES.includes(pathname),
    [pathname]
  );

  return (
    <div className="w-screen h-screen flex flex-row flex-nowrap justify-start">
      {shouldShowSidebar && <AppSidebar />}
      <main className="grow h-screen flex flex-col flex-nowrap overflow-x-hidden overflow-y-auto relative items-center box-border">
        <Routes>
          <Route element={<AuthenticatedRouter />}>
            <Route index element={<FeedPage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/profile" element={<ProfileLayout />}>
              <Route path="/profile/:id" element={<ViewProfilePage />} />
            </Route>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/p/:postId" element={<ViewDetailedPostPage />} />
          </Route>
          <Route element={<UnauthenticatedRouter />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<UnauthenticatedRouter />}>
            <Route path="/recipe" element={<RecipePage />} />
          </Route>
          <Route path="*" element={<div>404 - Not found</div>} />
        </Routes>
        <Toaster position="top-right" closeButton={false} />
      </main>
    </div>
  );
}

export default App;
