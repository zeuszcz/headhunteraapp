import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HelpHint } from "../components/HelpHint";
import { useAuth, type UserRole } from "../context/AuthContext";

export function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("worker");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await register(email, password, role);
      nav("/profile");
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card form-narrow">
      <h2 className="page-title" style={{ fontSize: "1.35rem" }}>
        Регистрация
      </h2>
      {err ? <p className="form-error">{err}</p> : null}
      <form onSubmit={onSubmit} className="form-stack">
        <label>
          <span className="title-with-hint">
            Роль
            <HelpHint title="Роли в сервисе" label="Справка по ролям">
              <p>
                <strong>Компания</strong> публикует объекты и ведёт отклики. <strong>Работник</strong> и{" "}
                <strong>бригада</strong> откликаются и получают чаты по задачам.
              </p>
              <p>Роль задаётся один раз при регистрации.</p>
            </HelpHint>
          </span>
          <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            <option value="company">Компания</option>
            <option value="worker">Работник</option>
            <option value="brigade">Бригада</option>
          </select>
        </label>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Пароль (мин. 8 символов)
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={busy} className="btn btn--primary" style={{ width: "100%" }}>
          {busy ? "…" : "Зарегистрироваться"}
        </button>
      </form>
      <p style={{ marginTop: "1rem", marginBottom: 0, color: "var(--color-muted)", fontSize: "0.9rem" }}>
        Уже есть аккаунт? <Link to="/login">Вход</Link>
      </p>
    </div>
  );
}
