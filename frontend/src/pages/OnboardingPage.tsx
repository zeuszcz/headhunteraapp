import { Link } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";

export function OnboardingPage() {
  const { me } = useAuth();

  const primaryHref = me?.role === "company" ? "/dashboard" : "/feed";
  const primaryLabel = me?.role === "company" ? "В кабинет компании" : "К объектам в ленте";

  return (
    <PageLayout
      title="Добро пожаловать"
      subtitle="Три шага, чтобы начать работу с платформой."
      breadcrumbs={[{ to: "/", label: "Главная" }, { label: "Старт" }]}
    >
      <div className="onboarding-steps">
        <div className="card onboarding-step">
          <div className="landing-step__num">1</div>
          <h2 className="onboarding-step__title">Заполните профиль</h2>
          <p className="muted" style={{ margin: 0 }}>
            Добавьте город, контакты и описание — так исполнители и компании быстрее доверяют карточке.
          </p>
          <Link to="/profile" className="btn btn--primary" style={{ marginTop: "0.85rem", alignSelf: "start" }}>
            Открыть профиль
          </Link>
        </div>
        <div className="card onboarding-step">
          <div className="landing-step__num">2</div>
          <h2 className="onboarding-step__title">
            {me?.role === "company" ? "Создайте объект" : "Найдите задачу"}
          </h2>
          <p className="muted" style={{ margin: 0 }}>
            {me?.role === "company"
              ? "Опубликуйте объект в кабинете или перейдите к форме создания."
              : "Откройте ленту и отфильтруйте объекты по городу и ключевым словам."}
          </p>
          <Link
            to={me?.role === "company" ? "/objects/new" : "/feed"}
            className="btn btn--secondary"
            style={{ marginTop: "0.85rem", alignSelf: "start" }}
          >
            {me?.role === "company" ? "Новый объект" : "Лента объектов"}
          </Link>
        </div>
        <div className="card onboarding-step">
          <div className="landing-step__num">3</div>
          <h2 className="onboarding-step__title">Чаты и уведомления</h2>
          <p className="muted" style={{ margin: 0 }}>
            Ответы по задачам приходят в чаты; важные события дублируются в уведомлениях.
          </p>
          <div className="flex-gap" style={{ marginTop: "0.85rem" }}>
            <Link to="/chats" className="btn btn--ghost btn--sm">
              Чаты
            </Link>
            <Link to="/notifications" className="btn btn--ghost btn--sm">
              Уведомления
            </Link>
          </div>
        </div>
      </div>
      <p style={{ marginTop: "1.5rem" }}>
        <Link to={primaryHref} className="btn btn--primary">
          {primaryLabel}
        </Link>
        <Link to="/help" className="btn btn--ghost" style={{ marginLeft: "0.5rem" }}>
          Помощь
        </Link>
      </p>
    </PageLayout>
  );
}
