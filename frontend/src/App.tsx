import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { ChatRoom } from "./pages/ChatRoom";
import { Chats } from "./pages/Chats";
import { CompanyAnalytics } from "./pages/CompanyAnalytics";
import { CompanyTalent } from "./pages/CompanyTalent";
import { Dashboard } from "./pages/Dashboard";
import { Feed } from "./pages/Feed";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { NotificationsPage } from "./pages/NotificationsPage";
import { NewObject } from "./pages/NewObject";
import { ObjectDetail } from "./pages/ObjectDetail";
import { ProfilePage } from "./pages/ProfilePage";
import { Register } from "./pages/Register";
import { EditObject } from "./pages/EditObject";
import { SettingsPage } from "./pages/SettingsPage";
import { ShortlistPage } from "./pages/ShortlistPage";

function Protected({ children }: { children: ReactElement }) {
  const { me, loading } = useAuth();
  if (loading) {
    return (
      <div className="protected-skeleton" aria-busy="true" aria-label="Загрузка">
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line" style={{ marginTop: "1rem" }} />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
    );
  }
  if (!me) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/objects/:id/edit"
          element={
            <Protected>
              <EditObject />
            </Protected>
          }
        />
        <Route path="/objects/:id" element={<ObjectDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <ProfilePage />
            </Protected>
          }
        />
        <Route
          path="/settings"
          element={
            <Protected>
              <SettingsPage />
            </Protected>
          }
        />
        <Route
          path="/objects/new"
          element={
            <Protected>
              <NewObject />
            </Protected>
          }
        />
        <Route
          path="/chats"
          element={
            <Protected>
              <Chats />
            </Protected>
          }
        />
        <Route
          path="/chats/:id"
          element={
            <Protected>
              <ChatRoom />
            </Protected>
          }
        />
        <Route
          path="/talent"
          element={
            <Protected>
              <CompanyTalent />
            </Protected>
          }
        />
        <Route
          path="/shortlist"
          element={
            <Protected>
              <ShortlistPage />
            </Protected>
          }
        />
        <Route
          path="/analytics/company"
          element={
            <Protected>
              <CompanyAnalytics />
            </Protected>
          }
        />
        <Route
          path="/notifications"
          element={
            <Protected>
              <NotificationsPage />
            </Protected>
          }
        />
      </Route>
    </Routes>
  );
}
