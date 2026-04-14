import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { WorkerProfile } from "../types/profiles";

type Props = {
  worker: WorkerProfile;
  actions?: ReactNode;
};

function initials(name: string): string {
  const p = name.trim().split(/\s+/).slice(0, 2);
  return p.map((s) => s[0]?.toUpperCase() ?? "").join("") || "?";
}

export function WorkerCard({ worker: w, actions }: Props) {
  const loc = [w.city, w.willing_to_travel ? "выезды ОК" : null].filter(Boolean).join(" · ");
  return (
    <article className="talent-card card">
      <div className="talent-card__head">
        <div className="talent-card__avatar" aria-hidden>
          {initials(w.full_name)}
        </div>
        <div className="talent-card__head-text">
          <div className="talent-card__title">
            <Link to={`/u/worker/${w.user_id}`} className="talent-card__title-link">
              {w.full_name}
            </Link>
          </div>
          <div className="talent-card__subtitle">
            {[w.profession, w.specialization].filter(Boolean).join(" · ") || "Профессия не указана"}
          </div>
          <div className="talent-card__rating">
            ★ {w.rating_avg.toFixed(1)} · отзывов {w.reviews_count}
          </div>
        </div>
      </div>
      {loc ? <div className="talent-card__meta">{loc}</div> : null}
      {w.experience_years != null ? (
        <div className="talent-card__meta">Опыт: {w.experience_years} лет</div>
      ) : null}
      {w.work_format ? <div className="talent-card__meta">Формат: {w.work_format}</div> : null}
      {w.skills_text ? <p className="talent-card__text">{w.skills_text}</p> : null}
      {w.bio ? <p className="talent-card__bio">{w.bio.length > 220 ? `${w.bio.slice(0, 220)}…` : w.bio}</p> : null}
      {w.desired_rate_note ? (
        <div className="talent-card__highlight">
          <strong>Условия:</strong> {w.desired_rate_note}
        </div>
      ) : null}
      {w.portfolio_note ? (
        <div className="talent-card__meta">
          <strong>Портфолио:</strong> {w.portfolio_note}
        </div>
      ) : null}
      {actions ? <div className="talent-card__actions flex-gap">{actions}</div> : null}
    </article>
  );
}
