import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/http";
import { HelpHint } from "../components/HelpHint";
import { PageLayout } from "../components/PageLayout";
import type { WorkObjectFormPayload } from "../components/WorkObjectForm";
import { WorkObjectForm } from "../components/WorkObjectForm";
import { useAuth } from "../context/AuthContext";

export function NewObject() {
  const { me } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);

  if (me?.role !== "company") {
    return (
      <div className="card form-wide">
        <p className="muted">Только для компаний.</p>
      </div>
    );
  }

  async function handleSubmit(payload: WorkObjectFormPayload) {
    setErr(null);
    try {
      const o = await apiFetch<{ id: string }>("/api/v1/objects", {
        method: "POST",
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
      nav(`/objects/${o.id}`);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Ошибка");
    }
  }

  const sidebar = (
    <>
      <h3>Советы</h3>
      <p>Чем конкретнее описание и регион, тем проще исполнителям откликнуться с реальной ценой и сроками.</p>
      <p className="title-with-hint" style={{ marginBottom: 0 }}>
        <span>Публикация</span>
        <HelpHint title="Черновик и публикация" label="Справка по статусу публикации">
          <p>
            <strong>Open</strong> — карточка видна в ленте. <strong>Черновик</strong> — только у вас в кабинете, можно
            доработать текст перед выходом на рынок.
          </p>
        </HelpHint>
      </p>
    </>
  );

  return (
    <PageLayout
      title="Новый объект / задача"
      subtitle="Заполните поля — после сохранения откроется карточка объекта."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/dashboard", label: "Кабинет" },
        { to: "/objects/new", label: "Новый объект" },
      ]}
      sidebar={sidebar}
    >
      <WorkObjectForm
        mode="create"
        defaultValues={{}}
        onSubmit={handleSubmit}
        submitLabel="Сохранить"
        error={err}
      />
    </PageLayout>
  );
}
