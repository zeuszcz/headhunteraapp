import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/http";
import { DashboardObjectCard } from "../components/DashboardObjectCard";
import { EmptyState } from "../components/EmptyState";
import { PageLayout } from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import type { WorkObject } from "../types/workObject";

export function Dashboard() {
  const { me } = useAuth();
  const [mine, setMine] = useState<WorkObject[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (me?.role !== "company") {
      return;
    }
    setErr(null);
    try {
      const data = await apiFetch<WorkObject[]>("/api/v1/objects/company/mine");
      setMine(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }, [me?.role]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!me) {
    return <p className="muted">Войдите, чтобы видеть кабинет.</p>;
  }

  if (me.role === "company") {
    return (
      <PageLayout
        title="Кабинет компании"
        subtitle="Ваши объекты и быстрые переходы к исполнителям и аналитике."
        breadcrumbs={[
          { to: "/", label: "Главная" },
          { to: "/dashboard", label: "Кабинет" },
        ]}
        actions={
          <>
            <Link to="/objects/new" className="btn btn--primary">
              Новый объект
            </Link>
          </>
        }
      >
        {err ? <p className="form-error">{err}</p> : null}
        <div className="flex-gap" style={{ marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <Link to="/talent" className="btn btn--secondary">
            Исполнители
          </Link>
          <Link to="/shortlist" className="btn btn--ghost">
            Избранное
          </Link>
          <Link to="/analytics/company" className="btn btn--ghost">
            Аналитика
          </Link>
        </div>
        <h2 className="section-title">Ваши объекты</h2>
        {mine.length === 0 ? (
          <EmptyState
            title="Пока нет опубликованных объектов"
            description="Создайте карточку объекта или задачи — она появится здесь и в ленте для исполнителей."
            primaryAction={{ to: "/objects/new", label: "Создать объект" }}
            secondaryAction={{ to: "/feed", label: "Открыть ленту" }}
          />
        ) : (
          <ul className="feed-grid">
            {mine.map((o) => (
              <li key={o.id} className="feed-card">
                <DashboardObjectCard object={o} />
              </li>
            ))}
          </ul>
        )}
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Кабинет исполнителя"
      subtitle="Лента объектов, отклики и профиль — основные шаги."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/dashboard", label: "Кабинет" },
      ]}
      actions={
        <Link to="/feed" className="btn btn--primary">
          К объектам
        </Link>
      }
    >
      <div className="card">
        <p className="page-lead" style={{ marginBottom: 0 }}>
          Смотрите <Link to="/feed">ленту объектов</Link> и откликайтесь с условиями. Профиль можно заполнить в разделе
          «Профиль».
        </p>
      </div>
    </PageLayout>
  );
}
