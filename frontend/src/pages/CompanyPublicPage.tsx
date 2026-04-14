import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/http";
import { DetailFactRow } from "../components/DetailFactRow";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconClipboard,
  IconFileText,
  IconMessage,
  IconPin,
  IconWallet,
} from "../components/ObjectDetailIcons";
import { PageLayout } from "../components/PageLayout";
import { parseCompanyProfile, type CompanyProfile } from "../types/profiles";

export function CompanyPublicPage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setErr(null);
    setLoading(true);
    try {
      const raw = await apiFetch<Record<string, unknown>>(`/api/v1/profiles/companies/${userId}`, {
        auth: false,
      });
      setProfile(parseCompanyProfile(raw));
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
      <PageLayout title="Компания" breadcrumbs={[{ to: "/feed", label: "Объекты" }]}>
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
      <PageLayout title="Компания" breadcrumbs={[{ to: "/feed", label: "Объекты" }]}>
        <p className="form-error">{err ?? "Не найдено"}</p>
        <Link to="/feed" className="btn btn--secondary">
          К ленте
        </Link>
      </PageLayout>
    );
  }

  const title = profile.company_name || "Компания";

  return (
    <PageLayout
      title={title}
      subtitle={profile.city ? <span className="muted">{profile.city}</span> : <span className="muted">Публичный профиль</span>}
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/feed", label: "Объекты" },
        { label: title },
      ]}
    >
      <div className="object-detail__sheet card">
        <div className="object-detail__sheet-body">
          <p className="object-detail__profile-rating muted">
            Рейтинг: {profile.rating_avg.toFixed(1)} · отзывов: {profile.reviews_count}
          </p>

          {profile.description ? (
            <section className="object-detail__block">
              <h2 className="object-detail__block-title">
                <IconBuilding className="object-detail__block-title-icon" />
                О компании
              </h2>
              <p className="object-detail__prose">{profile.description}</p>
            </section>
          ) : null}

          <div className="object-detail__fact-grid">
            {profile.regions_text ? (
              <DetailFactRow icon={<IconPin />} label="Регионы" value={profile.regions_text} />
            ) : null}
            {profile.project_types ? (
              <DetailFactRow icon={<IconBriefcase />} label="Типы проектов" value={profile.project_types} />
            ) : null}
            {profile.years_on_market != null ? (
              <DetailFactRow icon={<IconCalendar />} label="На рынке" value={`${profile.years_on_market} лет`} />
            ) : null}
            {profile.contact_person ? (
              <DetailFactRow icon={<IconMessage />} label="Контактное лицо" value={profile.contact_person} />
            ) : null}
            {profile.phone ? (
              <DetailFactRow icon={<IconMessage />} label="Телефон" value={profile.phone} />
            ) : null}
            {profile.email_public ? (
              <DetailFactRow icon={<IconMessage />} label="Email" value={profile.email_public} />
            ) : null}
            {profile.messengers_text ? (
              <DetailFactRow icon={<IconMessage />} label="Мессенджеры" value={profile.messengers_text} />
            ) : null}
            {profile.cooperation_terms ? (
              <DetailFactRow icon={<IconClipboard />} label="Условия сотрудничества" value={profile.cooperation_terms} fullWidth />
            ) : null}
            {profile.avg_budget_note ? (
              <DetailFactRow icon={<IconWallet />} label="Бюджеты" value={profile.avg_budget_note} />
            ) : null}
            {profile.payment_methods_text ? (
              <DetailFactRow icon={<IconWallet />} label="Оплата" value={profile.payment_methods_text} />
            ) : null}
            {profile.media_note ? (
              <DetailFactRow icon={<IconFileText />} label="Медиа и портфолио" value={profile.media_note} fullWidth />
            ) : null}
          </div>

          <p style={{ margin: 0 }}>
            <Link to="/feed" className="btn btn--secondary">
              ← К ленте объектов
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
