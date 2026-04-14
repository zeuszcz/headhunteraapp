import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/http";
import { DetailFactRow } from "../components/DetailFactRow";
import {
  IconBriefcase,
  IconClipboard,
  IconFileText,
  IconPin,
  IconUsers,
  IconWallet,
  IconWrench,
} from "../components/ObjectDetailIcons";
import { PageLayout } from "../components/PageLayout";
import { parseWorkerProfile, type WorkerProfile } from "../types/profiles";

export function WorkerPublicPage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setErr(null);
    setLoading(true);
    try {
      const raw = await apiFetch<Record<string, unknown>>(`/api/v1/profiles/workers/${userId}`, { auth: false });
      setProfile(parseWorkerProfile(raw));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <PageLayout title="Работник" breadcrumbs={[{ to: "/talent", label: "Каталог" }]}>
        <div className="object-detail__sheet card">
          <div className="object-detail__sheet-body">
            <div className="skeleton-screen" aria-busy="true" aria-label="Загрузка">
              <div className="skeleton-line skeleton-line--title" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (err || !profile) {
    return (
      <PageLayout title="Работник" breadcrumbs={[{ to: "/talent", label: "Каталог" }]}>
        <p className="form-error">{err ?? "Не найдено"}</p>
        <Link to="/talent" className="btn btn--secondary">
          К каталогу
        </Link>
      </PageLayout>
    );
  }

  const subtitleParts = [profile.profession, profile.specialization].filter(Boolean).join(" · ");
  const title = profile.full_name || "Работник";

  return (
    <PageLayout
      title={title}
      subtitle={
        subtitleParts ? (
          <span className="muted">{subtitleParts}</span>
        ) : profile.city ? (
          <span className="muted">{profile.city}</span>
        ) : (
          <span className="muted">Публичный профиль</span>
        )
      }
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/talent", label: "Каталог" },
        { label: title },
      ]}
    >
      <div className="object-detail__sheet card">
        <div className="object-detail__sheet-body">
          <p className="object-detail__profile-rating muted">
            Рейтинг: {profile.rating_avg.toFixed(1)} · отзывов: {profile.reviews_count}
          </p>

          {profile.avatar_url ? (
            <div className="public-profile-avatar">
              <img src={profile.avatar_url} alt="" />
            </div>
          ) : null}

          <div className="object-detail__chips" role="list">
            {profile.city ? (
              <span className="object-detail__chip" role="listitem">
                <IconPin className="object-detail__chip-svg" />
                {profile.city}
              </span>
            ) : null}
            <span className="object-detail__chip" role="listitem">
              <IconUsers className="object-detail__chip-svg" />
              {profile.willing_to_travel ? "Готов к выездам" : "Без выездов"}
            </span>
          </div>

          {profile.bio ? (
            <section className="object-detail__block">
              <h2 className="object-detail__block-title">
                <IconFileText className="object-detail__block-title-icon" />
                О себе
              </h2>
              <p className="object-detail__prose">{profile.bio}</p>
            </section>
          ) : null}

          <div className="object-detail__fact-grid">
            {profile.experience_years != null ? (
              <DetailFactRow icon={<IconBriefcase />} label="Опыт" value={`${profile.experience_years} лет`} />
            ) : null}
            {profile.work_format ? (
              <DetailFactRow icon={<IconClipboard />} label="Формат работы" value={profile.work_format} />
            ) : null}
            {profile.skills_text ? (
              <DetailFactRow icon={<IconWrench />} label="Навыки" value={profile.skills_text} fullWidth />
            ) : null}
            {profile.desired_rate_note ? (
              <DetailFactRow icon={<IconWallet />} label="Условия и ставка" value={profile.desired_rate_note} fullWidth />
            ) : null}
            {profile.portfolio_note ? (
              <DetailFactRow icon={<IconFileText />} label="Портфолио" value={profile.portfolio_note} fullWidth />
            ) : null}
            {profile.documents_note ? (
              <DetailFactRow icon={<IconClipboard />} label="Документы" value={profile.documents_note} fullWidth />
            ) : null}
          </div>

          <p style={{ margin: 0 }}>
            <Link to="/talent" className="btn btn--secondary">
              ← К каталогу исполнителей
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
