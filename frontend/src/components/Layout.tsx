import { Outlet } from "react-router-dom";
import { AppFooter } from "./AppFooter";
import { AppNav } from "./AppNav";

export function Layout() {
  return (
    <div className="app-shell">
      <AppNav />
      <div className="app-main page-enter">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
}
