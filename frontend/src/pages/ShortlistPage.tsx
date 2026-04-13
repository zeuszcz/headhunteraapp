import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/http";
import { BrigadeCard } from "../components/BrigadeCard";
import { EmptyState } from "../components/EmptyState";
import { PageLayout } from "../components/PageLayout";
import { WorkerCard } from "../components/WorkerCard";
import { useAuth } from "../context/AuthContext";
import { parseBrigadeProfile, parseWorkerProfile, type BrigadeProfile, type WorkerProfile } from "../types/profiles";

export function ShortlistPage() {
  const { me } = useAuth();
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [brigades, setBrigades] = useState<BrigadeProfile[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const [w, b] = await Promise.all([
        apiFetch<Record<string, unknown>[]>("/api/v1/shortlist/workers"),
        apiFetch<Record<string, unknown>[]>("/api/v1/shortlist/brigades"),
      ]);
      setWorkers(w.map((r) => parseWorkerProfile(r)));
      setBrigades(b.map((r) => parseBrigadeProfile(r)));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }, []);

  useEffect(() => {
    if (me?.role === "company") void load();
  }, [me?.role, load]);

  if (me?.role !== "company") {
    return (
      <div className="card">
        <p className="muted">Только для компаний.</p>
      </div>
    );
  }

  const empty = workers.length === 0 && brigades.length === 0;

  return (
    <PageLayout
      title="Избранные исполнители"
      subtitle="Работники и бригады, которых вы сохранили из каталога."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/shortlist", label: "Избранное" },
      ]}
      actions={
        <Link to="/talent" className="btn btn--primary">
          К каталогу
        </Link>
      }
    >
      {err ? <p className="form-error">{err}</p> : null}
      {empty && !err ? (
        <EmptyState
          title="Избранное пусто"
          description="Откройте каталог исполнителей и нажмите «В избранное» на карточке работника или бригады."
          primaryAction={{ to: "/talent", label: "Исполнители" }}
          secondaryAction={{ to: "/feed", label: "Лента объектов" }}
        />
      ) : (
        <>
          <h2 className="section-title">Работники</h2>
          {workers.length === 0 ? (
            <p className="muted" style={{ marginBottom: "1.25rem" }}>
              Пока нет избранных работников.
            </p>
          ) : (
            <ul className="feed-list" style={{ marginBottom: "1.5rem" }}>
              {workers.map((w) => (
                <li key={w.user_id} className="feed-card">
                  <WorkerCard worker={w} />
                </li>
              ))}
            </ul>
          )}
          <h2 className="section-title">Бригады</h2>
          {brigades.length === 0 ? (
            <p className="muted">Пока нет избранных бригад.</p>
          ) : (
            <ul className="feed-list">
              {brigades.map((b) => (
                <li key={b.user_id} className="feed-card">
                  <BrigadeCard brigade={b} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </PageLayout>
  );
}
