import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/http";
import { DetailFactRow } from "../components/DetailFactRow";
import {
  IconBriefcase,
  IconClipboard,
  IconFileText,
  IconPin,
  IconUsersGroup,
  IconWallet,
  IconWrench,
} from "../components/ObjectDetailIcons";
import { PageLayout } from "../components/PageLayout";
import { parseBrigadeProfile, type BrigadeProfile } from "../types/profiles";

export function BrigadePublicPage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<BrigadeProfile | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setErr(null);
    setLoading(true);
    try {
      const raw = await apiFetch<Record<string, unknown>>(`/api/v1/profiles/brigades/${userId}`, { auth: false });
      setProfile(parseBrigadeProfile(raw));
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
      <PageLayout title="Бригада" breadcrumbs={[{ to: "/talent", label: "Каталог" }]}>
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
      <PageLayout title="Бригада" breadcrumbs={[{ to: "/talent", label: "Каталог" }]}>
        <p className="form-error">{err ?? "Не найдено"}</p>
        <Link to="/talent" className="btn btn--secondary">
          К каталогу
        </Link>
      </PageLayout>
    );
  }

  const title = profile.name || "Бригада";
  const subtitleLine = [
    profile.specialization,
    `${profile.headcount} чел.`,
    profile.leader_name ? `Рук.: ${profile.leader_name}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <PageLayout
      title={title}
      subtitle={<span className="muted">{subtitleLine || "Публичный профиль"}</span>}
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

          <div className="object-detail__chips" role="list">
            <span className="object-detail__chip" role="listitem">
              <IconUsersGroup className="object-detail__chip-svg" />
              {profile.headcount} чел.
            </span>
            {profile.has_tools ? (
              <span className="object-detail__chip" role="listitem">
                <IconWrench className="object-detail__chip-svg" />
                Свой инструмент
              </span>
            ) : null}
            {profile.has_transport ? (
              <span className="object-detail__chip" role="listitem">
                <IconBriefcase className="object-detail__chip-svg" />
                Транспорт
              </span>
            ) : null}
          </div>

          {profile.bio ? (
            <section className="object-detail__block">
              <h2 className="object-detail__block-title">
                <IconFileText className="object-detail__block-title-icon" />
                О бригаде
              </h2>
              <p className="object-detail__prose">{profile.bio}</p>
            </section>
          ) : null}

          <div className="object-detail__fact-grid">
            {profile.leader_name ? (
              <DetailFactRow icon={<IconUsersGroup />} label="Руководитель" value={profile.leader_name} />
            ) : null}
            {profile.regions_text ? (
              <DetailFactRow icon={<IconPin />} label="Регионы" value={profile.regions_text} />
            ) : null}
            {profile.roles_composition_text ? (
              <DetailFactRow icon={<IconUsersGroup />} label="Состав" value={profile.roles_composition_text} fullWidth />
            ) : null}
            {profile.past_objects_note ? (
              <DetailFactRow icon={<IconBriefcase />} label="Опыт на объектах" value={profile.past_objects_note} fullWidth />
            ) : null}
            {profile.avg_price_note ? (
              <DetailFactRow icon={<IconWallet />} label="Цены" value={profile.avg_price_note} />
            ) : null}
            {profile.availability_note ? (
              <DetailFactRow icon={<IconClipboard />} label="Доступность" value={profile.availability_note} fullWidth />
            ) : null}
            {profile.portfolio_note ? (
              <DetailFactRow icon={<IconFileText />} label="Портфолио" value={profile.portfolio_note} fullWidth />
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
