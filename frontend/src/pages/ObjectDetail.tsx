import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/http";
import { DetailFactRow } from "../components/DetailFactRow";
import { EmptyState } from "../components/EmptyState";
import { HelpHint } from "../components/HelpHint";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconClipboard,
  IconClock,
  IconFileText,
  IconMessage,
  IconPin,
  IconStatus,
  IconUsers,
  IconUsersGroup,
  IconWallet,
  IconWrench,
  IconZap,
} from "../components/ObjectDetailIcons";
import { Modal } from "../components/Modal";
import { PageLayout } from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { WorkObject } from "../types/workObject";

type ObjectResponse = {
  id: string;
  applicant_user_id: string;
  applicant_kind: string;
  proposed_price_note: string | null;
  proposed_timeline_text: string | null;
  message_text: string | null;
  status: string;
};

export function ObjectDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { me } = useAuth();
  const toast = useToast();
  const [obj, setObj] = useState<WorkObject | null>(null);
  const [responses, setResponses] = useState<ObjectResponse[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [timeline, setTimeline] = useState("");
  const [msg, setMsg] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setErr(null);
    try {
      const o = await apiFetch<WorkObject>(`/api/v1/objects/${id}`, { auth: false });
      setObj(o);
      if (me?.role === "company" && me.id === o.company_user_id) {
        const r = await apiFetch<ObjectResponse[]>(`/api/v1/objects/${id}/responses`);
        setResponses(r);
      } else {
        setResponses([]);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }, [id, me]);

  useEffect(() => {
    void load();
  }, [load]);

  function flashOk(message: string) {
    toast.show(message);
  }

  async function submitResponse() {
    if (!id) {
      return;
    }
    setErr(null);
    try {
      await apiFetch(`/api/v1/objects/${id}/responses`, {
        method: "POST",
        body: JSON.stringify({
          proposed_price_note: price || null,
          proposed_timeline_text: timeline || null,
          message_text: msg || null,
        }),
      });
      setPrice("");
      setTimeline("");
      setMsg("");
      flashOk("Отклик отправлен");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }

  async function openChatWithCompany() {
    if (!id || !obj) {
      return;
    }
    setErr(null);
    try {
      const conv = await apiFetch<{ id: string }>("/api/v1/chat/conversations", {
        method: "POST",
        body: JSON.stringify({ work_object_id: id }),
      });
      nav(`/chats/${conv.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }

  async function openChatWithApplicant(applicantId: string) {
    if (!id) {
      return;
    }
    setErr(null);
    try {
      const conv = await apiFetch<{ id: string }>("/api/v1/chat/conversations", {
        method: "POST",
        body: JSON.stringify({ work_object_id: id, peer_user_id: applicantId }),
      });
      nav(`/chats/${conv.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }

  async function submitReview(targetUserId: string) {
    if (!id) {
      return;
    }
    setErr(null);
    try {
      await apiFetch("/api/v1/reviews", {
        method: "POST",
        body: JSON.stringify({
          target_user_id: targetUserId,
          work_object_id: id,
          rating: reviewRating,
          comment: reviewText || null,
        }),
      });
      setReviewText("");
      flashOk("Отзыв сохранён");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }

  async function setResponseStatus(rid: string, status: string) {
    try {
      await apiFetch(`/api/v1/responses/${rid}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      void load();
      flashOk("Статус отклика обновлён");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }

  if (!obj) {
    return err ? (
      <p className="form-error">{err}</p>
    ) : (
      <div className="card" style={{ maxWidth: 360 }}>
        <div className="skeleton-screen" aria-busy="true">
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--short" />
        </div>
      </div>
    );
  }

  const isCompanyViewer = me?.role === "company" && me.id === obj.company_user_id;
  const canRespond =
    me && (me.role === "worker" || me.role === "brigade") && me.id !== obj.company_user_id;

  const breadcrumbs = [
    { to: "/", label: "Главная" },
    { to: "/feed", label: "Объекты" },
    { to: `/objects/${obj.id}`, label: obj.title },
  ];

  const editAction =
    isCompanyViewer ? (
      <Link to={`/objects/${obj.id}/edit`} className="btn btn--secondary">
        Редактировать
      </Link>
    ) : null;

  const startLabel = obj.start_date
    ? new Date(obj.start_date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <PageLayout title={obj.title} actions={editAction} breadcrumbs={breadcrumbs}>
      <div className="object-detail__sheet card">
        {obj.cover_image_url ? (
          <div className="object-detail__cover object-detail__cover--in-sheet">
            <img src={obj.cover_image_url} alt="" className="object-detail__cover-img" />
          </div>
        ) : null}

        <div className="object-detail__sheet-body">
          <div className="object-detail__chips" role="list">
            {obj.address_or_region ? (
              <span className="object-detail__chip" role="listitem">
                <IconPin className="object-detail__chip-svg" />
                {obj.address_or_region}
              </span>
            ) : null}
            {obj.work_type ? (
              <span className="object-detail__chip" role="listitem">
                <IconBriefcase className="object-detail__chip-svg" />
                {obj.work_type}
              </span>
            ) : null}
            <span className="object-detail__chip object-detail__chip--status" role="listitem">
              <IconStatus className="object-detail__chip-svg" />
              {obj.status}
              <HelpHint title="Статус объекта" label="Что означает статус">
                <p>Статус задаёт этап жизни карточки: черновик, открыта к откликам, в работе или закрыта.</p>
                <p>Компания управляет статусом в кабинете; исполнители видят актуальное значение в ленте и здесь.</p>
              </HelpHint>
            </span>
          </div>

          {obj.company_name || obj.company_city ? (
            <div className="object-detail__company-row">
              <div className="object-detail__company-main">
                {obj.company_avatar_url ? (
                  <img src={obj.company_avatar_url} alt="" className="object-detail__company-avatar-img" />
                ) : (
                  <IconBuilding className="object-detail__company-icon" />
                )}
                <div>
                  <div className="object-detail__company-name">{obj.company_name ?? "Компания"}</div>
                  {obj.company_city ? <div className="object-detail__company-city muted">{obj.company_city}</div> : null}
                </div>
              </div>
              <Link to={`/u/company/${obj.company_user_id}`} className="btn btn--sm btn--secondary">
                Профиль компании
              </Link>
            </div>
          ) : null}

          {obj.description ? (
            <section className="object-detail__block">
              <h2 className="object-detail__block-title">
                <IconFileText className="object-detail__block-title-icon" />
                Описание
              </h2>
              <p className="object-detail__prose">{obj.description}</p>
            </section>
          ) : null}

          <div className="object-detail__fact-grid">
            <DetailFactRow icon={<IconUsers />} label="Нужно людей" value={String(obj.workers_needed)} />
            {obj.brigades_needed > 0 ? (
              <DetailFactRow icon={<IconUsersGroup />} label="Бригад" value={String(obj.brigades_needed)} />
            ) : null}
            {startLabel ? <DetailFactRow icon={<IconCalendar />} label="Старт работ" value={startLabel} /> : null}
            {obj.duration_days ? (
              <DetailFactRow icon={<IconClock />} label="Длительность" value={`${obj.duration_days} дн.`} />
            ) : null}
            {obj.payment_format ? (
              <DetailFactRow icon={<IconWallet />} label="Формат оплаты" value={obj.payment_format} />
            ) : null}
            {obj.payment_amount_note ? (
              <DetailFactRow icon={<IconWallet />} label="Сумма / условия оплаты" value={obj.payment_amount_note} />
            ) : null}
            {obj.urgency ? <DetailFactRow icon={<IconZap />} label="Срочность" value={obj.urgency} /> : null}
            {obj.conditions_text ? (
              <DetailFactRow
                icon={<IconClipboard />}
                label="Условия и требования"
                value={obj.conditions_text}
                fullWidth
              />
            ) : null}
          </div>

          {obj.required_skills_text ? (
            <section className="object-detail__block object-detail__block--skills">
              <h2 className="object-detail__block-title">
                <IconWrench className="object-detail__block-title-icon" />
                Навыки
              </h2>
              <p className="object-detail__prose">{obj.required_skills_text}</p>
            </section>
          ) : null}

          {obj.contact_override ? (
            <div className="object-detail__contact-banner">
              <IconMessage className="object-detail__contact-icon" />
              <div>
                <div className="object-detail__contact-label">Контакт по объекту</div>
                <div className="object-detail__contact-text">{obj.contact_override}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Modal
        open={rejectId !== null}
        title="Отклонить отклик?"
        onClose={() => setRejectId(null)}
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setRejectId(null)}>
              Отмена
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => {
                if (rejectId) void setResponseStatus(rejectId, "rejected");
                setRejectId(null);
              }}
            >
              Отклонить
            </button>
          </>
        }
      >
        <p style={{ margin: 0 }}>Исполнитель увидит отклонённый статус. Продолжить?</p>
      </Modal>

      {err ? <p className="form-error">{err}</p> : null}

      {canRespond ? (
        <p>
          <button type="button" className="btn btn--secondary" onClick={() => void openChatWithCompany()}>
            Написать компании
          </button>
        </p>
      ) : null}

      {canRespond ? (
        <div className="section-block">
          <h2 className="section-title">Отклик с условиями</h2>
          <div className="form-stack" style={{ maxWidth: 420 }}>
            <input
              placeholder="Предложение по цене"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              placeholder="Сроки выхода"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            />
            <textarea
              placeholder="Сообщение компании"
              rows={3}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button type="button" className="btn btn--primary" style={{ justifySelf: "start" }} onClick={() => void submitResponse()}>
              Отправить отклик
            </button>
          </div>
        </div>
      ) : null}

      {isCompanyViewer ? (
        <div style={{ marginTop: "1.5rem" }}>
          <h2 className="section-title">Отклики</h2>
          {responses.length === 0 ? (
            <EmptyState
              title="Пока нет откликов"
              description="Когда исполнители откликнутся, их предложения появятся в этом списке."
              primaryAction={{ to: "/feed", label: "Лента объектов" }}
            />
          ) : (
            <ul className="feed-list">
              {responses.map((r) => (
                <li key={r.id} className="feed-card card">
                  <div>
                    Участник: {r.applicant_kind} · {r.status}
                  </div>
                  {r.proposed_price_note ? <div>Цена: {r.proposed_price_note}</div> : null}
                  {r.proposed_timeline_text ? <div>Сроки: {r.proposed_timeline_text}</div> : null}
                  {r.message_text ? <div>{r.message_text}</div> : null}
                  {r.status === "pending" ? (
                    <div className="flex-gap" style={{ marginTop: "0.75rem" }}>
                      <button type="button" className="btn btn--primary btn--sm" onClick={() => void setResponseStatus(r.id, "accepted")}>
                        Принять
                      </button>
                      <button type="button" className="btn btn--danger btn--sm" onClick={() => setRejectId(r.id)}>
                        Отклонить
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => void openChatWithApplicant(r.applicant_user_id)}
                      >
                        Чат с исполнителем
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {me && me.id !== obj.company_user_id ? (
        <div className="section-block" style={{ marginTop: "1.25rem" }}>
          <h2 className="section-title">Отзыв о компании</h2>
          <div className="flex-gap" style={{ marginBottom: "0.5rem" }}>
            <label>
              Оценка
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                style={{ marginLeft: 8 }}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <textarea
            rows={2}
            placeholder="Комментарий"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            style={{ width: "100%", marginBottom: "0.65rem" }}
          />
          <button type="button" className="btn btn--primary" onClick={() => void submitReview(obj.company_user_id)}>
            Отправить отзыв
          </button>
        </div>
      ) : null}

      <p style={{ marginTop: "1.5rem" }}>
        <Link to="/feed" className="back-link">
          ← К ленте
        </Link>
      </p>
    </PageLayout>
  );
}
