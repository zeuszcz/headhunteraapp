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
  work_object_title?: string | null;
  peer_display_name?: string | null;
  peer_role?: string | null;
};

function peerRoleLabel(role: string | null | undefined): string {
  switch (role) {
    case "company":
      return "Компания";
    case "worker":
      return "Работник";
    case "brigade":
      return "Бригада";
    default:
      return "Участник";
  }
}

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
      <div className="chats-page card">
        {err ? <p className="form-error">{err}</p> : null}
        {items.length === 0 && !err ? (
          <EmptyState
            title="Пока нет диалогов"
            description="Откликнитесь на объект из ленты или откройте чат из карточки объекта — переписка появится здесь."
            primaryAction={{ to: "/feed", label: "Открыть ленту" }}
            secondaryAction={{ to: "/dashboard", label: "Кабинет" }}
          />
        ) : (
          <ul className="chats-page__list">
            {items.map((c) => {
              const objectTitle = c.work_object_title?.trim() || "Объект без названия";
              const peerName = c.peer_display_name?.trim() || "Собеседник";
              return (
                <li key={c.id}>
                  <Link to={`/chats/${c.id}`} className="chats-page__item">
                    <div className="chats-page__item-text">
                      <div className="chats-page__object-title">{objectTitle}</div>
                      <div className="chats-page__peer-row">
                        <span className="chats-page__peer-name">{peerName}</span>
                        {c.peer_role ? (
                          <span className="chats-page__role badge">{peerRoleLabel(c.peer_role)}</span>
                        ) : null}
                      </div>
                    </div>
                    <span className="chats-page__chevron" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageLayout>
  );
}
