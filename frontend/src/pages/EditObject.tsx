import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/http";
import { HelpHint } from "../components/HelpHint";
import { PageLayout } from "../components/PageLayout";
import type { WorkObjectFormPayload } from "../components/WorkObjectForm";
import { WorkObjectForm } from "../components/WorkObjectForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { WorkObject } from "../types/workObject";

export function EditObject() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { me } = useAuth();
  const toast = useToast();
  const [obj, setObj] = useState<WorkObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      const o = await apiFetch<WorkObject>(`/api/v1/objects/${id}`, { auth: false });
      setObj(o);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
      setObj(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (me?.role !== "company") {
    return (
      <div className="card form-wide">
        <p className="muted">Только для компаний.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <PageLayout
        title="Редактирование объекта"
        breadcrumbs={[
          { to: "/", label: "Главная" },
          { to: "/dashboard", label: "Кабинет" },
          { label: "Редактирование" },
        ]}
      >
        <div className="protected-skeleton" aria-busy="true" aria-label="Загрузка">
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--short" />
        </div>
      </PageLayout>
    );
  }

  if (err || !obj) {
    return (
      <PageLayout
        title="Редактирование объекта"
        breadcrumbs={[
          { to: "/", label: "Главная" },
          { to: "/feed", label: "Объекты" },
        ]}
      >
        <p className="form-error">{err ?? "Объект не найден"}</p>
        <Link to="/feed" className="btn btn--secondary">
          К ленте
        </Link>
      </PageLayout>
    );
  }

  if (me.id !== obj.company_user_id) {
    return (
      <PageLayout title="Нет доступа" breadcrumbs={[{ to: "/feed", label: "Объекты" }]}>
        <p className="muted">Редактировать может только компания-владелец.</p>
        <Link to={`/objects/${obj.id}`} className="btn btn--secondary">
          К карточке
        </Link>
      </PageLayout>
    );
  }

  const defaultValues: Partial<WorkObjectFormPayload> = {
    title: obj.title,
    address_or_region: obj.address_or_region ?? "",
    description: obj.description ?? "",
    work_type: obj.work_type ?? "",
    required_skills_text: obj.required_skills_text ?? "",
    conditions_text: obj.conditions_text ?? "",
    payment_amount_note: obj.payment_amount_note ?? "",
    payment_format: obj.payment_format ?? "",
    urgency: obj.urgency ?? "",
    contact_override: obj.contact_override ?? "",
    cover_image_url: obj.cover_image_url ?? "",
    start_date: obj.start_date ? obj.start_date.slice(0, 10) : "",
    duration_days: obj.duration_days,
    workers_needed: obj.workers_needed,
    brigades_needed: obj.brigades_needed,
    status: obj.status,
  };

  async function handleSubmit(payload: WorkObjectFormPayload) {
    setErr(null);
    try {
      await apiFetch<WorkObject>(`/api/v1/objects/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: payload.title,
          address_or_region: payload.address_or_region,
          description: payload.description,
          work_type: payload.work_type,
          required_skills_text: payload.required_skills_text,
          conditions_text: payload.conditions_text,
          payment_amount_note: payload.payment_amount_note,
          payment_format: payload.payment_format,
          urgency: payload.urgency,
          contact_override: payload.contact_override,
          cover_image_url: payload.cover_image_url,
          start_date: payload.start_date,
          duration_days: payload.duration_days,
          workers_needed: payload.workers_needed,
          brigades_needed: payload.brigades_needed,
          status: payload.status,
        }),
      });
      toast.show("Изменения сохранены");
      nav(`/objects/${id}`);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Ошибка");
    }
  }

  const sidebar = (
    <>
      <h3>Советы</h3>
      <p>После смены статуса на «Закрыт» или «Отменён» карточка исчезнет из ленты для исполнителей.</p>
      <p className="title-with-hint" style={{ marginBottom: 0 }}>
        <span>Видимость</span>
        <HelpHint title="Лента и статус" label="Справка">
          <p>В ленту попадают объекты со статусами open и in_progress.</p>
        </HelpHint>
      </p>
    </>
  );

  return (
    <PageLayout
      title="Редактировать объект"
      subtitle={obj.title}
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/dashboard", label: "Кабинет" },
        { to: `/objects/${obj.id}`, label: "Карточка" },
        { to: `/objects/${obj.id}/edit`, label: "Редактирование" },
      ]}
      sidebar={sidebar}
    >
      <WorkObjectForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="Сохранить изменения"
        error={err}
      />
    </PageLayout>
  );
}
