import { useCallback, useEffect, useState } from "react";
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
    </>
  );

  return (
    <PageLayout
      title="Аналитика компании"
      subtitle="Краткая сводка по объектам и откликам."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/analytics/company", label: "Аналитика" },
      ]}
      sidebar={sidebar}
    >
      {err ? <p className="form-error">{err}</p> : null}
      {data ? (
        <div className="card stack-gap">
          <div>
            <strong>Объектов всего:</strong> {data.objects_total}
          </div>
          <div>
            <strong>Активных (open / in progress):</strong> {data.objects_open}
          </div>
          <div>
            <strong>Откликов всего:</strong> {data.responses_total}
          </div>
          <div>
            <strong>Ожидают решения:</strong> {data.responses_pending}
          </div>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: 400 }}>
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
