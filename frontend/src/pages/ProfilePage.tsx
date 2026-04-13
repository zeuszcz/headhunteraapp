import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/http";
import { HelpHint } from "../components/HelpHint";
import { PageLayout } from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import {
  parseBrigadeProfile,
  parseCompanyProfile,
  parseWorkerProfile,
  type BrigadeProfile,
  type CompanyProfile,
  type WorkerProfile,
} from "../types/profiles";

function emptyToNull(s: string): string | null {
  const t = s.trim();
  return t === "" ? null : t;
}

function profileCompletionCompany(p: CompanyProfile): number {
  const keys: (keyof CompanyProfile)[] = [
    "company_name",
    "description",
    "city",
    "regions_text",
    "project_types",
    "contact_person",
    "phone",
    "email_public",
    "cooperation_terms",
  ];
  let filled = 0;
  for (const k of keys) {
    const v = p[k];
    if (v !== null && v !== undefined && String(v).trim() !== "") filled += 1;
  }
  if (p.years_on_market != null && p.years_on_market > 0) filled += 1;
  return Math.round((filled / (keys.length + 1)) * 100);
}

function profileCompletionWorker(p: WorkerProfile): number {
  const keys: (keyof WorkerProfile)[] = [
    "full_name",
    "profession",
    "specialization",
    "skills_text",
    "city",
    "bio",
    "desired_rate_note",
    "work_format",
  ];
  let filled = 0;
  for (const k of keys) {
    const v = p[k];
    if (v !== null && v !== undefined && String(v).trim() !== "") filled += 1;
  }
  if (p.experience_years != null) filled += 1;
  return Math.round((filled / (keys.length + 1)) * 100);
}

function profileCompletionBrigade(p: BrigadeProfile): number {
  const keys: (keyof BrigadeProfile)[] = [
    "name",
    "leader_name",
    "specialization",
    "roles_composition_text",
    "regions_text",
    "past_objects_note",
    "bio",
    "avg_price_note",
    "availability_note",
  ];
  let filled = 0;
  for (const k of keys) {
    const v = p[k];
    if (typeof v === "boolean") {
      if (v) filled += 0.5;
    } else if (v !== null && v !== undefined && String(v).trim() !== "") filled += 1;
  }
  if (p.headcount > 1) filled += 0.5;
  return Math.min(100, Math.round((filled / 10) * 100));
}

export function ProfilePage() {
  const { me, refresh } = useAuth();
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [brigade, setBrigade] = useState<BrigadeProfile | null>(null);

  useEffect(() => {
    if (!me) return;
    const raw = me.profile as Record<string, unknown>;
    if (me.role === "company") setCompany(parseCompanyProfile(raw));
    else if (me.role === "worker") setWorker(parseWorkerProfile(raw));
    else setBrigade(parseBrigadeProfile(raw));
  }, [me]);

  const completion = useMemo(() => {
    if (!me) return 0;
    if (me.role === "company" && company) return profileCompletionCompany(company);
    if (me.role === "worker" && worker) return profileCompletionWorker(worker);
    if (me.role === "brigade" && brigade) return profileCompletionBrigade(brigade);
    return 0;
  }, [me, company, worker, brigade]);

  if (!me) {
    return <p className="muted">Войдите.</p>;
  }

  async function saveCompany(e: React.FormEvent) {
    e.preventDefault();
    if (!company) return;
    setErr(null);
    try {
      await apiFetch("/api/v1/profiles/company", {
        method: "PATCH",
        body: JSON.stringify({
          company_name: company.company_name.trim() || undefined,
          description: emptyToNull(company.description ?? ""),
          city: emptyToNull(company.city ?? ""),
          regions_text: emptyToNull(company.regions_text ?? ""),
          project_types: emptyToNull(company.project_types ?? ""),
          years_on_market: company.years_on_market,
          contact_person: emptyToNull(company.contact_person ?? ""),
          phone: emptyToNull(company.phone ?? ""),
          messengers_text: emptyToNull(company.messengers_text ?? ""),
          email_public: emptyToNull(company.email_public ?? ""),
          cooperation_terms: emptyToNull(company.cooperation_terms ?? ""),
          avg_budget_note: emptyToNull(company.avg_budget_note ?? ""),
          payment_methods_text: emptyToNull(company.payment_methods_text ?? ""),
          media_note: emptyToNull(company.media_note ?? ""),
        }),
      });
      setSaved(true);
      await refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Ошибка");
    }
  }

  async function saveWorker(e: React.FormEvent) {
    e.preventDefault();
    if (!worker) return;
    setErr(null);
    try {
      await apiFetch("/api/v1/profiles/worker", {
        method: "PATCH",
        body: JSON.stringify({
          full_name: worker.full_name.trim() || undefined,
          profession: emptyToNull(worker.profession ?? ""),
          specialization: emptyToNull(worker.specialization ?? ""),
          experience_years: worker.experience_years,
          skills_text: emptyToNull(worker.skills_text ?? ""),
          city: emptyToNull(worker.city ?? ""),
          willing_to_travel: worker.willing_to_travel,
          desired_rate_note: emptyToNull(worker.desired_rate_note ?? ""),
          work_format: emptyToNull(worker.work_format ?? ""),
          bio: emptyToNull(worker.bio ?? ""),
          documents_note: emptyToNull(worker.documents_note ?? ""),
          portfolio_note: emptyToNull(worker.portfolio_note ?? ""),
        }),
      });
      setSaved(true);
      await refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Ошибка");
    }
  }

  async function saveBrigade(e: React.FormEvent) {
    e.preventDefault();
    if (!brigade) return;
    setErr(null);
    try {
      await apiFetch("/api/v1/profiles/brigade", {
        method: "PATCH",
        body: JSON.stringify({
          name: brigade.name.trim() || undefined,
          leader_name: emptyToNull(brigade.leader_name ?? ""),
          headcount: brigade.headcount,
          roles_composition_text: emptyToNull(brigade.roles_composition_text ?? ""),
          specialization: emptyToNull(brigade.specialization ?? ""),
          past_objects_note: emptyToNull(brigade.past_objects_note ?? ""),
          regions_text: emptyToNull(brigade.regions_text ?? ""),
          has_tools: brigade.has_tools,
          has_transport: brigade.has_transport,
          avg_price_note: emptyToNull(brigade.avg_price_note ?? ""),
          availability_note: emptyToNull(brigade.availability_note ?? ""),
          bio: emptyToNull(brigade.bio ?? ""),
          portfolio_note: emptyToNull(brigade.portfolio_note ?? ""),
        }),
      });
      setSaved(true);
      await refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Ошибка");
    }
  }

  return (
    <PageLayout
      title="Профиль"
      subtitle="Заполните карточку — так компаниям и заказчикам проще принять решение."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/profile", label: "Профиль" },
      ]}
    >
      <div className="card form-wide">
        <div className="profile-completion" role="status" aria-label="Заполненность профиля">
          <div className="profile-completion__bar" style={{ width: `${completion}%` }} />
          <span className="profile-completion__label">Профиль заполнен на {completion}%</span>
        </div>
        {saved ? <p className="form-success">Сохранено</p> : null}
        {err ? <p className="form-error">{err}</p> : null}

        {me.role === "company" && company ? (
          <form onSubmit={saveCompany} className="form-stack">
            <fieldset className="form-section">
              <legend className="form-section__title">Компания</legend>
              <label>
                Название *
                <input
                  required
                  value={company.company_name}
                  onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
                />
              </label>
              <label>
                Город
                <input value={company.city ?? ""} onChange={(e) => setCompany({ ...company, city: e.target.value })} />
              </label>
              <label>
                Регионы работ
                <textarea
                  rows={2}
                  value={company.regions_text ?? ""}
                  onChange={(e) => setCompany({ ...company, regions_text: e.target.value })}
                  placeholder="Например: Москва и МО, Тверская область"
                />
              </label>
              <label>
                Описание
                <textarea
                  rows={4}
                  value={company.description ?? ""}
                  onChange={(e) => setCompany({ ...company, description: e.target.value })}
                />
              </label>
              <label>
                Типы проектов
                <textarea
                  rows={2}
                  value={company.project_types ?? ""}
                  onChange={(e) => setCompany({ ...company, project_types: e.target.value })}
                />
              </label>
              <label>
                Лет на рынке
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={company.years_on_market ?? ""}
                  onChange={(e) =>
                    setCompany({
                      ...company,
                      years_on_market: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </label>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section__title">Контакты</legend>
              <label>
                Контактное лицо
                <input
                  value={company.contact_person ?? ""}
                  onChange={(e) => setCompany({ ...company, contact_person: e.target.value })}
                />
              </label>
              <label>
                Телефон
                <input value={company.phone ?? ""} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
              </label>
              <label>
                Email (публичный)
                <input
                  type="email"
                  value={company.email_public ?? ""}
                  onChange={(e) => setCompany({ ...company, email_public: e.target.value })}
                />
              </label>
              <label>
                Мессенджеры
                <textarea
                  rows={2}
                  value={company.messengers_text ?? ""}
                  onChange={(e) => setCompany({ ...company, messengers_text: e.target.value })}
                  placeholder="Telegram, WhatsApp и т.д."
                />
              </label>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section__title">
                Условия работы
                <HelpHint title="Условия и оплата" label="Подсказка">
                  <p>Эти поля помогают исполнителям понять масштаб заказов и способы расчёта до отклика.</p>
                </HelpHint>
              </legend>
              <label>
                Условия сотрудничества
                <textarea
                  rows={3}
                  value={company.cooperation_terms ?? ""}
                  onChange={(e) => setCompany({ ...company, cooperation_terms: e.target.value })}
                />
              </label>
              <label>
                Средний бюджет (как ориентир)
                <input
                  value={company.avg_budget_note ?? ""}
                  onChange={(e) => setCompany({ ...company, avg_budget_note: e.target.value })}
                />
              </label>
              <label>
                Способы оплаты
                <textarea
                  rows={2}
                  value={company.payment_methods_text ?? ""}
                  onChange={(e) => setCompany({ ...company, payment_methods_text: e.target.value })}
                />
              </label>
              <label>
                Фото и медиа (ссылки или описание)
                <textarea
                  rows={2}
                  value={company.media_note ?? ""}
                  onChange={(e) => setCompany({ ...company, media_note: e.target.value })}
                  placeholder="Ссылки на сайт, портфолио, альбомы"
                />
              </label>
            </fieldset>

            <p className="muted profile-rating-line">
              Рейтинг: {company.rating_avg.toFixed(1)} · отзывов: {company.reviews_count}
            </p>
            <button type="submit" className="btn btn--primary" style={{ justifySelf: "start" }}>
              Сохранить
            </button>
          </form>
        ) : null}

        {me.role === "worker" && worker ? (
          <form onSubmit={saveWorker} className="form-stack">
            <fieldset className="form-section">
              <legend className="form-section__title">О себе</legend>
              <label>
                ФИО *
                <input
                  required
                  value={worker.full_name}
                  onChange={(e) => setWorker({ ...worker, full_name: e.target.value })}
                />
              </label>
              <label>
                Город
                <input value={worker.city ?? ""} onChange={(e) => setWorker({ ...worker, city: e.target.value })} />
              </label>
              <label>
                Профессия
                <input
                  value={worker.profession ?? ""}
                  onChange={(e) => setWorker({ ...worker, profession: e.target.value })}
                />
              </label>
              <label>
                Специализация
                <input
                  value={worker.specialization ?? ""}
                  onChange={(e) => setWorker({ ...worker, specialization: e.target.value })}
                />
              </label>
              <label>
                Стаж (лет)
                <input
                  type="number"
                  min={0}
                  max={80}
                  value={worker.experience_years ?? ""}
                  onChange={(e) =>
                    setWorker({
                      ...worker,
                      experience_years: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Формат работы
                <input
                  value={worker.work_format ?? ""}
                  onChange={(e) => setWorker({ ...worker, work_format: e.target.value })}
                  placeholder="Например: полный день, вахта"
                />
              </label>
              <label className="form-row-check">
                <input
                  type="checkbox"
                  checked={worker.willing_to_travel}
                  onChange={(e) => setWorker({ ...worker, willing_to_travel: e.target.checked })}
                />
                Готов к выездам в другие регионы
              </label>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section__title">Навыки и портфолио</legend>
              <label>
                Навыки
                <textarea
                  rows={3}
                  value={worker.skills_text ?? ""}
                  onChange={(e) => setWorker({ ...worker, skills_text: e.target.value })}
                />
              </label>
              <label>
                О себе
                <textarea rows={4} value={worker.bio ?? ""} onChange={(e) => setWorker({ ...worker, bio: e.target.value })} />
              </label>
              <label>
                Портфолио (ссылки или описание)
                <textarea
                  rows={2}
                  value={worker.portfolio_note ?? ""}
                  onChange={(e) => setWorker({ ...worker, portfolio_note: e.target.value })}
                />
              </label>
              <label>
                Документы (разряды, допуски — текстом)
                <textarea
                  rows={2}
                  value={worker.documents_note ?? ""}
                  onChange={(e) => setWorker({ ...worker, documents_note: e.target.value })}
                />
              </label>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section__title">Условия</legend>
              <label>
                Желаемая ставка / условия
                <textarea
                  rows={2}
                  value={worker.desired_rate_note ?? ""}
                  onChange={(e) => setWorker({ ...worker, desired_rate_note: e.target.value })}
                />
              </label>
            </fieldset>

            <p className="muted profile-rating-line">
              Рейтинг: {worker.rating_avg.toFixed(1)} · отзывов: {worker.reviews_count}
            </p>
            <button type="submit" className="btn btn--primary" style={{ justifySelf: "start" }}>
              Сохранить
            </button>
          </form>
        ) : null}

        {me.role === "brigade" && brigade ? (
          <form onSubmit={saveBrigade} className="form-stack">
            <fieldset className="form-section">
              <legend className="form-section__title">Бригада</legend>
              <label>
                Название *
                <input required value={brigade.name} onChange={(e) => setBrigade({ ...brigade, name: e.target.value })} />
              </label>
              <label>
                Руководитель / контактное лицо
                <input
                  value={brigade.leader_name ?? ""}
                  onChange={(e) => setBrigade({ ...brigade, leader_name: e.target.value })}
                />
              </label>
              <label>
                Численность
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={brigade.headcount}
                  onChange={(e) => setBrigade({ ...brigade, headcount: Number(e.target.value) || 1 })}
                />
              </label>
              <label>
                Специализация
                <input
                  value={brigade.specialization ?? ""}
                  onChange={(e) => setBrigade({ ...brigade, specialization: e.target.value })}
                />
              </label>
              <label>
                Состав (роли в бригаде)
                <textarea
                  rows={3}
                  value={brigade.roles_composition_text ?? ""}
                  onChange={(e) => setBrigade({ ...brigade, roles_composition_text: e.target.value })}
                />
              </label>
              <label>
                Регионы выезда
                <textarea
                  rows={2}
                  value={brigade.regions_text ?? ""}
                  onChange={(e) => setBrigade({ ...brigade, regions_text: e.target.value })}
                />
              </label>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section__title">Опыт и ресурсы</legend>
              <label>
                Прошлые объекты (кратко)
                <textarea
                  rows={3}
                  value={brigade.past_objects_note ?? ""}
                  onChange={(e) => setBrigade({ ...brigade, past_objects_note: e.target.value })}
                />
              </label>
              <label className="form-row-check">
                <input
                  type="checkbox"
                  checked={brigade.has_tools}
                  onChange={(e) => setBrigade({ ...brigade, has_tools: e.target.checked })}
                />
                Свой инструмент
              </label>
              <label className="form-row-check">
                <input
                  type="checkbox"
                  checked={brigade.has_transport}
                  onChange={(e) => setBrigade({ ...brigade, has_transport: e.target.checked })}
                />
                Свой транспорт
              </label>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section__title">Коммерция и доступность</legend>
              <label>
                Средняя цена / вилка
                <textarea
                  rows={2}
                  value={brigade.avg_price_note ?? ""}
                  onChange={(e) => setBrigade({ ...brigade, avg_price_note: e.target.value })}
                />
              </label>
              <label>
                Доступность (график, сроки выхода)
                <textarea
                  rows={2}
                  value={brigade.availability_note ?? ""}
                  onChange={(e) => setBrigade({ ...brigade, availability_note: e.target.value })}
                />
              </label>
              <label>
                О бригаде
                <textarea rows={3} value={brigade.bio ?? ""} onChange={(e) => setBrigade({ ...brigade, bio: e.target.value })} />
              </label>
              <label>
                Портфолио
                <textarea
                  rows={2}
                  value={brigade.portfolio_note ?? ""}
                  onChange={(e) => setBrigade({ ...brigade, portfolio_note: e.target.value })}
                />
              </label>
            </fieldset>

            <p className="muted profile-rating-line">
              Рейтинг: {brigade.rating_avg.toFixed(1)} · отзывов: {brigade.reviews_count}
            </p>
            <button type="submit" className="btn btn--primary" style={{ justifySelf: "start" }}>
              Сохранить
            </button>
          </form>
        ) : null}
      </div>
    </PageLayout>
  );
}
