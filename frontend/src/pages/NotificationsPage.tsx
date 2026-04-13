import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/http";
import { EmptyState } from "../components/EmptyState";
import { PageLayout } from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";

type NotificationRow = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

export function NotificationsPage() {
  const { me } = useAuth();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const data = await apiFetch<NotificationRow[]>("/api/v1/notifications");
      setItems(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }, []);

  useEffect(() => {
    if (me) void load();
  }, [me, load]);

  async function markRead(id: string) {
    try {
      await apiFetch(`/api/v1/notifications/${id}/read`, { method: "PATCH" });
      void load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }

  if (!me) {
    return null;
  }

  return (
    <PageLayout
      title="Уведомления"
      subtitle="События по откликам, статусам и сообщениям."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/notifications", label: "Уведомления" },
      ]}
    >
      {err ? <p className="form-error">{err}</p> : null}
      {items.length === 0 && !err ? (
        <EmptyState
          title="Пока пусто"
          description="Когда появятся отклики и изменения по объектам, уведомления отобразятся здесь."
          primaryAction={{ to: "/feed", label: "Лента объектов" }}
        />
      ) : (
        <ul className="feed-list">
          {items.map((n) => (
            <li key={n.id} className="feed-card card card--interactive">
              <div style={{ fontWeight: 600 }}>{n.title}</div>
              {n.body ? <div>{n.body}</div> : null}
              <div className="muted" style={{ fontSize: "0.85rem" }}>
                {new Date(n.created_at).toLocaleString()}
                {n.read_at ? " · прочитано" : null}
              </div>
              {!n.read_at ? (
                <button type="button" className="btn btn--secondary btn--sm" style={{ marginTop: 8 }} onClick={() => void markRead(n.id)}>
                  Прочитано
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </PageLayout>
  );
}
