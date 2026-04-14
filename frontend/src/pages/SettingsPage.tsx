import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/http";
import { PageLayout } from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

export function SettingsPage() {
  const { me, logout } = useAuth();
  const toast = useToast();
  const { theme, setTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await apiFetch("/api/v1/auth/me/password", {
        method: "PATCH",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      setCurrentPassword("");
      setNewPassword("");
      toast.show("Пароль обновлён");
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageLayout
      title="Настройки аккаунта"
      subtitle="Оформление, пароль и выход из приложения."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/dashboard", label: "Кабинет" },
        { label: "Настройки" },
      ]}
    >
      <div className="card form-wide">
        <p style={{ marginTop: 0 }}>
          <strong>Email:</strong> {me?.email}
        </p>
        <p className="muted" style={{ marginBottom: "1.25rem" }}>
          Роль: {me?.role}
        </p>

        <h2 className="section-title" style={{ fontSize: "1.05rem", marginTop: 0 }}>
          Оформление
        </h2>
        <div className="form-row-check" style={{ marginBottom: "1.25rem" }}>
          <label>
            <input
              type="radio"
              name="theme"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
            />
            Светлая тема
          </label>
          <label>
            <input
              type="radio"
              name="theme"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
            />
            Тёмная тема
          </label>
        </div>

        <h2 className="section-title" style={{ fontSize: "1.05rem" }}>
          Смена пароля
        </h2>
        {err ? <p className="form-error">{err}</p> : null}
        <form onSubmit={(e) => void onPasswordSubmit(e)} className="form-stack">
          <label>
            Текущий пароль
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Новый пароль (не короче 8 символов)
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "Сохранение…" : "Сохранить пароль"}
          </button>
        </form>

        <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "1.75rem 0" }} />

        <h2 className="section-title" style={{ fontSize: "1.05rem" }}>
          Сессия
        </h2>
        <button type="button" className="btn btn--secondary" onClick={() => void logout()}>
          Выйти из аккаунта
        </button>
        <p className="muted" style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          <Link to="/profile">Перейти в профиль</Link> для данных компании или исполнителя.
        </p>
      </div>
    </PageLayout>
  );
}
