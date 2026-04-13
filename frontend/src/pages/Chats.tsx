import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/http";
import { EmptyState } from "../components/EmptyState";
import { PageLayout } from "../components/PageLayout";

type Conv = {
  id: string;
  work_object_id: string;
  company_user_id: string;
  participant_user_id: string;
  created_at: string;
};

export function Chats() {
  const [items, setItems] = useState<Conv[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const data = await apiFetch<Conv[]>("/api/v1/chat/conversations");
      setItems(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PageLayout
      title="Чаты"
      subtitle="Диалоги по объектам, в которые вы вступили после отклика или приглашения."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/chats", label: "Чаты" },
      ]}
    >
      <div className="card">
        {err ? <p className="form-error">{err}</p> : null}
        {items.length === 0 && !err ? (
          <EmptyState
            title="Пока нет диалогов"
            description="Откликнитесь на объект из ленты или откройте чат из карточки объекта — переписка появится здесь."
            primaryAction={{ to: "/feed", label: "Открыть ленту" }}
            secondaryAction={{ to: "/dashboard", label: "Кабинет" }}
          />
        ) : (
          <ul className="feed-list chats-list">
            {items.map((c) => (
              <li key={c.id} className="feed-card">
                <Link to={`/chats/${c.id}`}>Чат по объекту {c.work_object_id.slice(0, 8)}…</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageLayout>
  );
}
