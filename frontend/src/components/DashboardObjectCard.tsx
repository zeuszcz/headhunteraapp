import { Link } from "react-router-dom";
import {
  IconBriefcase,
  IconCalendar,
  IconClock,
  IconPin,
  IconUsers,
  IconWallet,
  IconZap,
} from "./ObjectDetailIcons";
import type { WorkObject } from "../types/workObject";
import {
  formatDateRuShort,
  workObjectNeedsSummary,
  workObjectPaymentSummary,
  workObjectStatusLabel,
} from "../lib/workObjectLabels";

type Props = { object: WorkObject };

export function DashboardObjectCard({ object: o }: Props) {
  const payment = workObjectPaymentSummary(o);
  const needs = workObjectNeedsSummary(o);
  const startLabel = formatDateRuShort(o.start_date);
  const createdLabel = formatDateRuShort(o.created_at);
  const statusClass = o.status.replace(/[^a-z0-9_-]/gi, "") || "unknown";

  return (
    <article className="feed-object-card cabinet-object-card card card--interactive">
      <Link
        to={`/objects/${o.id}`}
        className="feed-object-card__media cabinet-object-card__media-link"
        aria-label={`Открыть объект «${o.title}»`}
      >
        {o.cover_image_url ? (
          <img src={o.cover_image_url} alt="" className="feed-object-card__img" loading="lazy" />
        ) : (
          <div className="feed-object-card__placeholder" aria-hidden />
        )}
      </Link>
      <div className="feed-object-card__body cabinet-object-card__body">
        <div className="cabinet-object-card__head">
          <Link to={`/objects/${o.id}`} className="feed-object-card__title cabinet-object-card__title-link">
            {o.title}
          </Link>
          <span
            className={`cabinet-object-card__status cabinet-object-card__status--${statusClass}`}
            title="Статус объекта"
          >
            {workObjectStatusLabel(o.status)}
          </span>
        </div>

        <div className="feed-object-card__facts">
          <div className="feed-object-card__fact">
            <IconPin className="feed-object-card__fact-icon" />
            <div className="feed-object-card__fact-text">
              <span className="feed-object-card__fact-label">Регион / адрес</span>
              <span className="feed-object-card__fact-value">
                {o.address_or_region?.trim() || "Не указан"}
              </span>
            </div>
          </div>
          <div className="feed-object-card__fact">
            <IconBriefcase className="feed-object-card__fact-icon" />
            <div className="feed-object-card__fact-text">
              <span className="feed-object-card__fact-label">Вид работ</span>
              <span className="feed-object-card__fact-value">{o.work_type?.trim() || "Не указан"}</span>
            </div>
          </div>
          <div className="feed-object-card__fact">
            <IconWallet className="feed-object-card__fact-icon" />
            <div className="feed-object-card__fact-text">
              <span className="feed-object-card__fact-label">Оплата и условия</span>
              <span className="feed-object-card__fact-value">{payment || "Не указано"}</span>
            </div>
          </div>
        </div>

        {(startLabel || o.duration_days != null) ? (
          <div className="cabinet-object-card__subfacts">
            {startLabel ? (
              <div className="feed-object-card__fact">
                <IconCalendar className="feed-object-card__fact-icon" />
                <div className="feed-object-card__fact-text">
                  <span className="feed-object-card__fact-label">Старт</span>
                  <span className="feed-object-card__fact-value">{startLabel}</span>
                </div>
              </div>
            ) : null}
            {o.duration_days != null ? (
              <div className="feed-object-card__fact">
                <IconClock className="feed-object-card__fact-icon" />
                <div className="feed-object-card__fact-text">
                  <span className="feed-object-card__fact-label">Срок</span>
                  <span className="feed-object-card__fact-value">
                    {o.duration_days} {pluralDays(o.duration_days)}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {needs ? (
          <div className="feed-object-card__fact cabinet-object-card__fact--needs">
            <IconUsers className="feed-object-card__fact-icon" />
            <div className="feed-object-card__fact-text">
              <span className="feed-object-card__fact-label">Потребность</span>
              <span className="feed-object-card__fact-value">{needs}</span>
            </div>
          </div>
        ) : null}

        {o.urgency?.trim() ? (
          <div className="feed-object-card__fact cabinet-object-card__fact--urgency">
            <IconZap className="feed-object-card__fact-icon" />
            <div className="feed-object-card__fact-text">
              <span className="feed-object-card__fact-label">Срочность</span>
              <span className="feed-object-card__fact-value">{o.urgency.trim()}</span>
            </div>
          </div>
        ) : null}

        <div className="cabinet-object-card__footer">
          {createdLabel ? (
            <span className="cabinet-object-card__created muted">Создан {createdLabel}</span>
          ) : (
            <span />
          )}
          <div className="cabinet-object-card__links">
            <Link to={`/objects/${o.id}`} className="btn btn--ghost btn--sm">
              Открыть
            </Link>
            <Link to={`/objects/${o.id}/edit`} className="btn btn--secondary btn--sm">
              Изменить
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function pluralDays(n: number): string {
  const m = n % 100;
  const m10 = n % 10;
  if (m >= 11 && m <= 14) return "дней";
  if (m10 === 1) return "день";
  if (m10 >= 2 && m10 <= 4) return "дня";
  return "дней";
}
