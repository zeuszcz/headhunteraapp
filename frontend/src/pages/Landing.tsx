import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Landing() {
  const { me } = useAuth();

  return (
    <div>
      <div className="card landing-hero">
        <h1 className="page-title">Рынок труда для стройки и монтажа</h1>
        <p className="page-lead" style={{ marginBottom: 0 }}>
          Компании публикуют объекты и задачи, работники и бригады откликаются с условиями. Профили сторон,
          отклики, чаты и отзывы — в одном месте.
        </p>
        <div className="hero-actions">
          <Link to="/feed" className="btn btn--primary">
            Смотреть объекты
          </Link>
          <Link to="/register" className="btn btn--ghost">
            Создать аккаунт
          </Link>
        </div>
      </div>

      {me ? (
        <section className="landing-section landing-section--alt" aria-labelledby="landing-map-title">
          <h2 id="landing-map-title" className="landing-section__title">
            Ваши разделы
          </h2>
          <p className="landing-section__lead">
            Быстрый переход к основным сценариям для роли «{me.role === "company" ? "компания" : me.role === "worker" ? "работник" : "бригада"}».
          </p>
          <div className="landing-map">
            <Link to="/feed" className="landing-map__card card--interactive">
              <strong>Объекты</strong>
              <span>Лента задач с фильтрами по городу и оплате.</span>
            </Link>
            <Link to="/dashboard" className="landing-map__card card--interactive">
              <strong>Кабинет</strong>
              <span>Обзор активности и быстрые действия.</span>
            </Link>
            <Link to="/profile" className="landing-map__card card--interactive">
              <strong>Профиль</strong>
              <span>Данные компании, работника или бригады.</span>
            </Link>
            {me.role === "company" ? (
              <>
                <Link to="/objects/new" className="landing-map__card card--interactive">
                  <strong>Новый объект</strong>
                  <span>Опубликовать задачу на рынок или в черновик.</span>
                </Link>
                <Link to="/talent" className="landing-map__card card--interactive">
                  <strong>Исполнители</strong>
                  <span>Каталог работников и бригад, избранное и чаты.</span>
                </Link>
                <Link to="/analytics/company" className="landing-map__card card--interactive">
                  <strong>Аналитика</strong>
                  <span>Сводка по объектам и откликам.</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/chats" className="landing-map__card card--interactive">
                  <strong>Чаты</strong>
                  <span>Диалоги по объектам после отклика.</span>
                </Link>
                <Link to="/notifications" className="landing-map__card card--interactive">
                  <strong>Уведомления</strong>
                  <span>События по откликам и статусам.</span>
                </Link>
              </>
            )}
          </div>
        </section>
      ) : null}

      <section className="landing-section" aria-labelledby="landing-how-title">
        <h2 id="landing-how-title" className="landing-section__title">
          Как это работает
        </h2>
        <p className="landing-section__lead">Три шага от публикации до работы на объекте.</p>
        <div className="landing-steps">
          <div className="landing-step">
            <div className="landing-step__num">1</div>
            <h3>Объект на рынке</h3>
            <p>Компания описывает задачу, регион и условия. Исполнители видят карточку в ленте.</p>
          </div>
          <div className="landing-step">
            <div className="landing-step__num">2</div>
            <h3>Отклик с условиями</h3>
            <p>Работник или бригада отправляет цену, сроки и сообщение. Стороны согласуют детали в чате.</p>
          </div>
          <div className="landing-step">
            <div className="landing-step__num">3</div>
            <h3>Решение и репутация</h3>
            <p>Компания принимает или отклоняет отклик. После работы можно оставить отзыв.</p>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--alt" aria-labelledby="landing-trust-title">
        <h2 id="landing-trust-title" className="landing-section__title">
          Прозрачность и контроль
        </h2>
        <p className="landing-section__lead">
          Платформа объединяет объявления, переписку и историю откликов — без лишних посредников в MVP.
        </p>
        <div className="landing-trust">
          <div className="landing-trust__item">
            Профили привязаны к роли: компания видит исполнителей в каталоге, исполнители — карточки объектов.
          </div>
          <div className="landing-trust__item">
            Уведомления и чаты помогают не терять статусы: отклик, принятие, сообщения по объекту.
          </div>
        </div>
      </section>
    </div>
  );
}
