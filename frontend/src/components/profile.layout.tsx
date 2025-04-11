import { ProfileProvider } from "@/contexts/profile.context";
import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <ProfileProvider>
      <Outlet />
    </ProfileProvider>
  );
}
