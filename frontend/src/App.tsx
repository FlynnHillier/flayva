import { Routes, Route, useLocation } from "react-router-dom";
import { Outlet, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { useMe } from "./hooks/auth.hooks";

/* Pages */
import HomePage from "./pages/Home.page";
import AppSidebar from "./components/layout/Sidebar";
import FeedPage from "./pages/Feed.page";
import LoginPage from "./pages/Login.page";
import LogoutPage from "./pages/Logout.page";
import CreatePostPage from "./pages/Create-post.page";
import RecipePage from "./pages/Recipe.page";
import EditProfile from "./pages/profile-pages/Edit-profile.page";
import ViewProfilePage from "./pages/profile-pages/Profile.page";
import SearchPage from './pages/Search.page'
import DevPage from "./pages/Dev.page";
import { Toaster } from "sonner";
import ProfileLayout from "@/pages/profile-pages/profile.layout";

/**
 * Routes that should not show the sidebar
 */
const HIDE_SIDEBAR_ROUTES = ["/login"];

/**
 * A router that protects the routes it wraps by checking if the user is authenticated.
 *
 */
function AuthenticatedRouter() {
  const { data, isPending } = useMe();

  if (isPending) return "loading..."; // TODO: better loading view

  if (!data?.authenticated || !data.user) return <Navigate to="/login" />;

  return <Outlet />;
}

/**
 * A router that protects the routes it wraps by checking if the user is unauthenticated.
 *
 */
function UnauthenticatedRouter() {
  const { data, isPending } = useMe();

  if (isPending) return "loading..."; // TODO: better loading view

  if (data?.authenticated || data?.user) return <Navigate to="/feed" />;

  return <Outlet />;
}

/**
 * The main application component.
 */
function App() {
  const { pathname } = useLocation();

  const shouldShowSidebar = useMemo(() => !HIDE_SIDEBAR_ROUTES.includes(pathname), [pathname]);

  return (
    <div className="w-screen h-screen flex flex-row flex-nowrap justify-start">
      {shouldShowSidebar && <AppSidebar />}
      <main className="grow h-screen flex flex-col flex-nowrap overflow-x-hidden overflow-y-auto relative items-center">
        <Routes>
          <Route index element={<HomePage />} />
          <Route element={<AuthenticatedRouter />}>
            <Route path="/post" element={<CreatePostPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/profile" element={<ProfileLayout />}>
              <Route path="/profile/:id" element={<ViewProfilePage />} />
            </Route>
            <Route path="/search" element={<SearchPage />} />
            {
              //TODO: change the location of profile edit
            }
            <Route path="/p/edit" element={<EditProfile />} />
          </Route>
          <Route element={<UnauthenticatedRouter />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route path="/dev" element={<DevPage />} />
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
