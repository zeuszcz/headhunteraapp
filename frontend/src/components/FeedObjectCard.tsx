import { Link } from "react-router-dom";
import { IconBriefcase, IconBuilding, IconPin, IconWallet } from "./ObjectDetailIcons";
import type { WorkObject } from "../types/workObject";

type Props = { object: WorkObject };

export function FeedObjectCard({ object: o }: Props) {
  const hasCompany = o.company_name || o.company_city;

  return (
    <article className="feed-object-card card card--interactive">
      <div className="feed-object-card__media">
        {o.cover_image_url ? (
          <img src={o.cover_image_url} alt="" className="feed-object-card__img" loading="lazy" />
        ) : (
          <div className="feed-object-card__placeholder" aria-hidden />
        )}
      </div>
      <div className="feed-object-card__body">
        {hasCompany ? (
          <div className="feed-object-card__company-block">
            {o.company_avatar_url ? (
              <img src={o.company_avatar_url} alt="" className="feed-object-card__company-avatar-lg" loading="lazy" />
            ) : (
              <div className="feed-object-card__company-fallback" aria-hidden>
                <IconBuilding className="feed-object-card__company-fallback-icon" />
              </div>
            )}
            <div className="feed-object-card__company-text">
              <span className="feed-object-card__kicker">Компания</span>
              {o.company_name ? <span className="feed-object-card__company-name">{o.company_name}</span> : null}
              {o.company_city ? (
                <span className="feed-object-card__company-city">
                  <IconPin className="feed-object-card__inline-icon" />
                  {o.company_city}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <Link to={`/objects/${o.id}`} className="feed-object-card__title">
          {o.title}
        </Link>

        <div className="feed-object-card__facts">
          <div className="feed-object-card__fact">
            <IconPin className="feed-object-card__fact-icon" />
            <div className="feed-object-card__fact-text">
              <span className="feed-object-card__fact-label">Регион объекта</span>
              <span className="feed-object-card__fact-value">{o.address_or_region?.trim() || "Не указан"}</span>
            </div>
          </div>
          <div className="feed-object-card__fact">
            <IconBriefcase className="feed-object-card__fact-icon" />
            <div className="feed-object-card__fact-text">
              <span className="feed-object-card__fact-label">Вид работ</span>
              <span className="feed-object-card__fact-value">{o.work_type?.trim() || "Не указан"}</span>
            </div>
          </div>
        </div>

        {o.payment_amount_note ? (
          <div className="feed-object-card__fact feed-object-card__fact--pay">
            <IconWallet className="feed-object-card__fact-icon" />
            <div className="feed-object-card__fact-text">
              <span className="feed-object-card__fact-label">Оплата</span>
              <span className="feed-object-card__fact-value">{o.payment_amount_note}</span>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
