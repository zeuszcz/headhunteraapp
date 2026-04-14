import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { BrigadeProfile } from "../types/profiles";

type Props = {
  brigade: BrigadeProfile;
  actions?: ReactNode;
};

export function BrigadeCard({ brigade: b, actions }: Props) {
  return (
    <article className="talent-card card">
      <div className="talent-card__head">
        <div className="talent-card__avatar talent-card__avatar--brigade" aria-hidden>
          {b.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="talent-card__head-text">
          <div className="talent-card__title">
            <Link to={`/u/brigade/${b.user_id}`} className="talent-card__title-link">
              {b.name}
            </Link>
          </div>
          <div className="talent-card__subtitle">
            {b.specialization || "Специализация не указана"} · {b.headcount} чел.
          </div>
          {b.leader_name ? <div className="talent-card__meta">Руководитель: {b.leader_name}</div> : null}
          <div className="talent-card__rating">
            ★ {b.rating_avg.toFixed(1)} · отзывов {b.reviews_count}
          </div>
        </div>
      </div>
      <div className="talent-card__chips flex-gap">
        {b.has_tools ? <span className="badge">Инструмент</span> : null}
        {b.has_transport ? <span className="badge">Транспорт</span> : null}
      </div>
      {b.regions_text ? <div className="talent-card__meta">Регионы: {b.regions_text}</div> : null}
      {b.roles_composition_text ? <p className="talent-card__text">{b.roles_composition_text}</p> : null}
      {b.bio ? <p className="talent-card__bio">{b.bio.length > 220 ? `${b.bio.slice(0, 220)}…` : b.bio}</p> : null}
      {b.past_objects_note ? (
        <div className="talent-card__meta">
          <strong>Опыт:</strong> {b.past_objects_note}
        </div>
      ) : null}
      {b.avg_price_note ? (
        <div className="talent-card__highlight">
          <strong>Цена:</strong> {b.avg_price_note}
        </div>
      ) : null}
      {b.availability_note ? (
        <div className="talent-card__meta">
          <strong>Доступность:</strong> {b.availability_note}
        </div>
      ) : null}
      {b.portfolio_note ? (
        <div className="talent-card__meta">
          <strong>Портфолио:</strong> {b.portfolio_note}
        </div>
      ) : null}
      {actions ? <div className="talent-card__actions flex-gap">{actions}</div> : null}
    </article>
  );
}
