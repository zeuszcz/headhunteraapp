import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await login(email, password);
      nav("/feed");
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card form-narrow">
      <h2 className="page-title" style={{ fontSize: "1.35rem" }}>
        Вход
      </h2>
      {err ? <p className="form-error">{err}</p> : null}
      <form onSubmit={onSubmit} className="form-stack">
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Пароль
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" disabled={busy} className="btn btn--primary" style={{ width: "100%" }}>
          {busy ? "…" : "Войти"}
        </button>
      </form>
      <p style={{ marginTop: "1rem", marginBottom: 0, color: "var(--color-muted)", fontSize: "0.9rem" }}>
        Нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>
    </div>
  );
}
