import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { createApplication, deleteApplication, fetchApplications } from "./api/client";
import type { JobApplication } from "./api/types";

const STATUS_OPTIONS = [
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
] as const;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function App() {
  const [items, setItems] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<string>("applied");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApplications();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await createApplication({
        company_name: company.trim(),
        role_title: role.trim(),
        status,
        notes: notes.trim() || null,
      });
      setCompany("");
      setRole("");
      setStatus("applied");
      setNotes("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Удалить запись?")) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await deleteApplication(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>headhunteraapp</h1>
          <p style={styles.sub}>
            Локальный трекер откликов: FastAPI + PostgreSQL + React. API проксируется с{" "}
            <code>/api</code> на бэкенд <code>:8000</code>.
          </p>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h2 style={styles.h2}>Новый отклик</h2>
          <form onSubmit={onSubmit} style={styles.form}>
            <label style={styles.label}>
              Компания
              <input
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Роль
              <input
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Senior Python"
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Статус
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={styles.input}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label style={styles.label}>
              Заметки
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Опционально"
                style={{ ...styles.input, resize: "vertical" }}
              />
            </label>
            <button type="submit" disabled={busy} style={styles.primary}>
              {busy ? "Сохранение…" : "Добавить"}
            </button>
          </form>
        </section>

        <section style={styles.card}>
          <div style={styles.rowBetween}>
            <h2 style={{ ...styles.h2, margin: 0 }}>Отклики</h2>
            <button type="button" onClick={() => void load()} style={styles.ghost} disabled={loading}>
              Обновить
            </button>
          </div>
          {error ? <p style={styles.err}>{error}</p> : null}
          {loading ? (
            <p>Загрузка…</p>
          ) : items.length === 0 ? (
            <p style={styles.muted}>Пока пусто — добавьте первый отклик.</p>
          ) : (
            <ul style={styles.list}>
              {items.map((a) => (
                <li key={a.id} style={styles.item}>
                  <div>
                    <strong>
                      {a.company_name} — {a.role_title}
                    </strong>
                    <div style={styles.meta}>
                      <span style={styles.badge}>{a.status}</span>
                      <span style={styles.muted}>{formatDate(a.applied_at)}</span>
                    </div>
                    {a.notes ? <p style={styles.notes}>{a.notes}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void onDelete(a.id)}
                    disabled={busy}
                    style={styles.danger}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: 880,
    margin: "0 auto",
    padding: "2rem 1.25rem 3rem",
  },
  header: {
    marginBottom: "1.75rem",
  },
  title: {
    margin: "0 0 0.35rem",
    fontSize: "1.75rem",
    letterSpacing: "-0.02em",
  },
  sub: {
    margin: 0,
    color: "#475569",
    fontSize: "0.95rem",
  },
  main: {
    display: "grid",
    gap: "1.25rem",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "1.25rem 1.35rem",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
  },
  h2: {
    margin: "0 0 1rem",
    fontSize: "1.15rem",
  },
  form: {
    display: "grid",
    gap: "0.85rem",
  },
  label: {
    display: "grid",
    gap: "0.35rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#334155",
  },
  input: {
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    padding: "0.5rem 0.65rem",
    background: "#fff",
  },
  primary: {
    border: "none",
    borderRadius: 8,
    padding: "0.65rem 1rem",
    fontWeight: 600,
    background: "#0f172a",
    color: "#fff",
    cursor: "pointer",
  },
  ghost: {
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    padding: "0.4rem 0.75rem",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.85rem",
  },
  rowBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
  },
  err: {
    color: "#b91c1c",
    fontWeight: 600,
  },
  muted: {
    color: "#64748b",
    margin: 0,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: "0.75rem",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "flex-start",
    padding: "0.85rem 0",
    borderBottom: "1px solid #e2e8f0",
  },
  meta: {
    display: "flex",
    gap: "0.65rem",
    alignItems: "center",
    marginTop: "0.35rem",
    flexWrap: "wrap",
  },
  badge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "0.15rem 0.45rem",
    borderRadius: 6,
  },
  notes: {
    margin: "0.5rem 0 0",
    color: "#475569",
    fontSize: "0.9rem",
  },
  danger: {
    border: "1px solid #fecaca",
    background: "#fff1f2",
    color: "#9f1239",
    borderRadius: 8,
    padding: "0.35rem 0.6rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
  },
};
