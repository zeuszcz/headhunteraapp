import { Link } from "react-router-dom";
import type { WorkObject } from "../types/workObject";

type Props = { object: WorkObject };

export function FeedObjectCard({ object: o }: Props) {
  const companyLine = [o.company_name, o.company_city].filter(Boolean).join(" · ");
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
        {companyLine ? <div className="feed-object-card__company">{companyLine}</div> : null}
        <Link to={`/objects/${o.id}`} className="feed-object-card__title">
          {o.title}
        </Link>
        <div className="feed-object-card__meta">
          {o.address_or_region || "Регион не указан"} · {o.work_type || "вид работ не указан"}
        </div>
        {o.payment_amount_note ? (
          <div className="feed-object-card__pay">Оплата: {o.payment_amount_note}</div>
        ) : null}
      </div>
    </article>
  );
}
