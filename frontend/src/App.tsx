import { Routes, Route, useLocation } from "react-router-dom";
import { Outlet, Navigate } from "react-router-dom";
import { useMemo } from "react";

/* Pages */
import HomePage from "@/pages/Home.page";
import AppSidebar from "@/components/AppSidebar";
import FeedPage from "./pages/Feed.page";
import LoginPage from "./pages/Login.page";
import { useMe } from "./hooks/auth.hooks";
import LogoutPage from "./pages/Logout.page";
import CreatePostPage from "./pages/Create-post.page";

/**
 * Routes that should not show the sidebar
 */
const HIDE_SIDEBAR_ROUTES = ["/login"];

/**
 * A router that protects the routes it wraps by checking if the user is authenticated.
 *
 */
function AuthenticatedRouter() {
  const { data, isLoading } = useMe();

  if (isLoading) return "loading..."; // TODO: better loading view

  if (!data?.authenticated || !data.user) return <Navigate to="/login" />;

  return <Outlet />;
}

/**
 * A router that protects the routes it wraps by checking if the user is unauthenticated.
 *
 */
function UnauthenticatedRouter() {
  const { data, isLoading } = useMe();

  if (isLoading) return "loading..."; // TODO: better loading view

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
    <div className="w-screen h-screen flex flex-row flex-nowrap justify-center">
      {shouldShowSidebar && <AppSidebar />}
      <main className="max-w-7xl border-x-2 border-red-800 border h-screen flex flex-col flex-nowrap overflow-auto">
        <Routes>
          <Route index element={<HomePage />} />
          <Route element={<AuthenticatedRouter />}>
            <Route path="/post" element={<CreatePostPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/feed" element={<FeedPage />} />
          </Route>
          <Route element={<UnauthenticatedRouter />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route path="*" element={<div>404 - Not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
