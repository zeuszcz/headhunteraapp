import { Outlet } from "react-router-dom";
import { AppFooter } from "./AppFooter";
import { AppNav } from "./AppNav";
import { MobileBottomNav } from "./MobileBottomNav";
import { useUnreadNotificationsCount } from "../hooks/useUnreadNotificationsCount";

export function Layout() {
  const unreadCount = useUnreadNotificationsCount();

  return (
    <div className="app-shell">
      <AppNav unreadCount={unreadCount} />
      <div className="app-main app-main--with-mobile-nav page-enter">
        <Outlet />
      </div>
      <AppFooter />
      <MobileBottomNav unreadCount={unreadCount} />
    </div>
  );
}
