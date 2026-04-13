import { useState } from "react";
import { HelpHint } from "./HelpHint";

export type WorkObjectFormPayload = {
  title: string;
  address_or_region: string | null;
  description: string | null;
  work_type: string | null;
  required_skills_text: string | null;
  conditions_text: string | null;
  payment_amount_note: string | null;
  payment_format: string | null;
  urgency: string | null;
  contact_override: string | null;
  cover_image_url: string | null;
  start_date: string | null;
  duration_days: number | null;
  workers_needed: number;
  brigades_needed: number;
  status: string;
};

type Props = {
  mode: "create" | "edit";
  defaultValues: Partial<WorkObjectFormPayload> & { title?: string };
  onSubmit: (payload: WorkObjectFormPayload) => Promise<void>;
  submitLabel: string;
  error: string | null;
};

export function WorkObjectForm({ mode, defaultValues, onSubmit, submitLabel, error }: Props) {
  const [title, setTitle] = useState(defaultValues.title ?? "");
  const [address, setAddress] = useState(defaultValues.address_or_region ?? "");
  const [description, setDescription] = useState(defaultValues.description ?? "");
  const [workType, setWorkType] = useState(defaultValues.work_type ?? "");
  const [skills, setSkills] = useState(defaultValues.required_skills_text ?? "");
  const [conditionsText, setConditionsText] = useState(defaultValues.conditions_text ?? "");
  const [payment, setPayment] = useState(defaultValues.payment_amount_note ?? "");
  const [paymentFormat, setPaymentFormat] = useState(defaultValues.payment_format ?? "");
  const [urgency, setUrgency] = useState(defaultValues.urgency ?? "");
  const [contactOverride, setContactOverride] = useState(defaultValues.contact_override ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(defaultValues.cover_image_url ?? "");
  const [startDate, setStartDate] = useState(defaultValues.start_date ?? "");
  const [durationDays, setDurationDays] = useState(
    defaultValues.duration_days != null ? String(defaultValues.duration_days) : "",
  );
  const [workersNeeded, setWorkersNeeded] = useState(defaultValues.workers_needed ?? 1);
  const [brigadesNeeded, setBrigadesNeeded] = useState(defaultValues.brigades_needed ?? 0);
  const [status, setStatus] = useState(
    defaultValues.status ?? (mode === "create" ? "open" : "open"),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      title,
      address_or_region: address || null,
      description: description || null,
      work_type: workType || null,
      required_skills_text: skills || null,
      conditions_text: conditionsText || null,
      payment_amount_note: payment || null,
      payment_format: paymentFormat || null,
      urgency: urgency || null,
      contact_override: contactOverride || null,
      cover_image_url: coverImageUrl.trim() || null,
      start_date: startDate || null,
      duration_days: durationDays === "" ? null : Number(durationDays),
      workers_needed: workersNeeded,
      brigades_needed: brigadesNeeded,
      status,
    });
  }

  return (
    <div className="card form-wide">
      {error ? <p className="form-error">{error}</p> : null}
      <form onSubmit={(e) => void handleSubmit(e)} className="form-stack">
        <fieldset className="form-section">
          <legend className="form-section__title">Основное</legend>
          <label>
            Название *
            <input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Адрес / регион
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <label>
            Описание
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label>
            Вид работ
            <input value={workType} onChange={(e) => setWorkType(e.target.value)} />
          </label>
          <label>
            Обложка (URL изображения)
            <input
              type="url"
              placeholder="https://…"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset className="form-section">
          <legend className="form-section__title">Требования</legend>
          <label>
            Нужные навыки
            <input value={skills} onChange={(e) => setSkills(e.target.value)} />
          </label>
          <label>
            Условия и требования (текст)
            <textarea rows={3} value={conditionsText} onChange={(e) => setConditionsText(e.target.value)} />
          </label>
          <label>
            Сколько человек нужно
            <input
              type="number"
              min={1}
              value={workersNeeded}
              onChange={(e) => setWorkersNeeded(Number(e.target.value) || 1)}
            />
          </label>
          <label>
            Сколько бригад (0 = не нужны)
            <input
              type="number"
              min={0}
              value={brigadesNeeded}
              onChange={(e) => setBrigadesNeeded(Number(e.target.value) || 0)}
            />
          </label>
        </fieldset>

        <fieldset className="form-section">
          <legend className="form-section__title">Сроки и оплата</legend>
          <label>
            Дата старта
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            Длительность (дней)
            <input
              type="number"
              min={1}
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              placeholder="необязательно"
            />
          </label>
          <label>
            Формат оплаты
            <input
              value={paymentFormat}
              onChange={(e) => setPaymentFormat(e.target.value)}
              placeholder="Например: по факту, аванс 30%"
            />
          </label>
          <label>
            Условия оплаты (сумма / вилка)
            <input value={payment} onChange={(e) => setPayment(e.target.value)} />
          </label>
          <label>
            Срочность
            <input
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              placeholder="Например: срочно, в течение недели"
            />
          </label>
        </fieldset>

        <fieldset className="form-section">
          <legend className="form-section__title">Контакты</legend>
          <label>
            Контакт в карточке (если отличается от профиля компании)
            <textarea rows={2} value={contactOverride} onChange={(e) => setContactOverride(e.target.value)} />
          </label>
          <label>
            Публикация
            {mode === "create" ? (
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="open">Сразу на рынок (open)</option>
                <option value="draft">Черновик (видите только вы)</option>
              </select>
            ) : (
              <>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="draft">Черновик</option>
                  <option value="open">На рынке (open)</option>
                  <option value="in_progress">В работе</option>
                  <option value="closed">Закрыт</option>
                  <option value="cancelled">Отменён</option>
                </select>
                <p className="title-with-hint" style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                  <span className="muted" style={{ fontSize: "0.88rem" }}>
                    Статус влияет на видимость в ленте.
                  </span>
                  <HelpHint title="Статусы объекта" label="Справка по статусам">
                    <p>
                      <strong>open</strong> и <strong>in_progress</strong> видны в ленте. <strong>draft</strong> —
                      только у вас. <strong>closed</strong> / <strong>cancelled</strong> — сняты с рынка.
                    </p>
                  </HelpHint>
                </p>
              </>
            )}
          </label>
        </fieldset>

        <button type="submit" className="btn btn--primary" style={{ justifySelf: "start" }}>
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
