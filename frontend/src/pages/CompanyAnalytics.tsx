import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/http";
import { HelpHint } from "../components/HelpHint";
import { PageLayout } from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";

type Summary = {
  objects_total: number;
  objects_open: number;
  responses_pending: number;
  responses_total: number;
};

export function CompanyAnalytics() {
  const { me } = useAuth();
  const [data, setData] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const s = await apiFetch<Summary>("/api/v1/analytics/company/summary");
      setData(s);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }, []);

  useEffect(() => {
    if (me?.role === "company") void load();
  }, [me?.role, load]);

  const pendingRatio = useMemo(() => {
    if (!data || data.responses_total <= 0) return 0;
    return Math.round((data.responses_pending / data.responses_total) * 100);
  }, [data]);

  if (me?.role !== "company") {
    return (
      <div className="card">
        <p className="muted">Только для компаний.</p>
        <Link to="/feed">На ленту</Link>
      </div>
    );
  }

  const sidebar = (
    <>
      <h3>О разделе</h3>
      <p>
        Сводка по вашим объектам и откликам. Используйте её, чтобы увидеть нагрузку и «хвост» необработанных откликов.
      </p>
      <p className="title-with-hint" style={{ marginBottom: 0 }}>
        <span>Показатели</span>
        <HelpHint title="Как читать цифры" label="Справка по аналитике">
          <p>«Активные» — объекты в работе или открытые к откликам (по правилам бэкенда).</p>
          <p>«Ожидают решения» — отклики в статусе ожидания вашего ответа.</p>
        </HelpHint>
      </p>
      <p style={{ marginTop: "1rem" }}>
        <Link to="/talent">Каталог исполнителей</Link>
        {" · "}
        <Link to="/shortlist">Избранное</Link>
      </p>
    </>
  );

  return (
    <PageLayout
      title="Аналитика компании"
      subtitle="Сводка по объектам и откликам, доля ожидающих решения и быстрые ссылки."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/analytics/company", label: "Аналитика" },
      ]}
      sidebar={sidebar}
    >
      {err ? <p className="form-error">{err}</p> : null}
      {data ? (
        <>
          <div className="analytics-kpi-grid">
            <article className="analytics-kpi card">
              <p className="analytics-kpi__label">Объектов всего</p>
              <p className="analytics-kpi__value">{data.objects_total}</p>
              <p className="analytics-kpi__hint muted">Все карточки в кабинете</p>
            </article>
            <article className="analytics-kpi card">
              <p className="analytics-kpi__label">Активных</p>
              <p className="analytics-kpi__value">{data.objects_open}</p>
              <p className="analytics-kpi__hint muted">Open / in progress</p>
            </article>
            <article className="analytics-kpi card">
              <p className="analytics-kpi__label">Откликов всего</p>
              <p className="analytics-kpi__value">{data.responses_total}</p>
              <p className="analytics-kpi__hint muted">По вашим объектам</p>
            </article>
            <article className="analytics-kpi card analytics-kpi--accent">
              <p className="analytics-kpi__label">Ожидают решения</p>
              <p className="analytics-kpi__value">{data.responses_pending}</p>
              <p className="analytics-kpi__hint muted">Статус pending</p>
            </article>
          </div>

          <div className="card analytics-bar-block">
            <h2 className="section-title" style={{ marginTop: 0 }}>
              Доля откликов без решения
            </h2>
            <p className="muted" style={{ marginTop: 0, fontSize: "0.92rem" }}>
              {data.responses_total === 0
                ? "Пока нет откликов — после первых откликов здесь появится полоса."
                : `${pendingRatio}% от всех откликов ещё в ожидании вашего ответа.`}
            </p>
            <div className="analytics-bar" role="progressbar" aria-valuenow={pendingRatio} aria-valuemin={0} aria-valuemax={100}>
              <div className="analytics-bar__fill" style={{ width: `${data.responses_total === 0 ? 0 : pendingRatio}%` }} />
            </div>
          </div>

          <div className="analytics-actions card">
            <h2 className="section-title" style={{ marginTop: 0 }}>
              Дальше
            </h2>
            <div className="flex-gap">
              <Link to="/dashboard" className="btn btn--secondary">
                Кабинет
              </Link>
              <Link to="/objects/new" className="btn btn--primary">
                Новый объект
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="skeleton-screen" aria-busy="true">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line--short" />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
