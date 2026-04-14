import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `app-nav__link${isActive ? " app-nav__link--active" : ""}`;

type AppNavProps = {
  unreadCount?: number;
};

export function AppNav({ unreadCount = 0 }: AppNavProps) {
  const { me, logout } = useAuth();

  return (
    <nav className="app-nav" aria-label="Основное меню">
      <NavLink to="/" end className={({ isActive }) => `app-nav__brand${isActive ? " app-nav__brand--active" : ""}`}>
        headhunteraapp
      </NavLink>

      {me ? (
        <>
          <div className="app-nav__group">
            <span className="app-nav__group-label">Работа</span>
            <NavLink to="/feed" className={linkClass}>
              Объекты
            </NavLink>
            <NavLink to="/dashboard" className={linkClass}>
              Кабинет
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              Профиль
            </NavLink>
            <NavLink to="/settings" className={linkClass}>
              Настройки
            </NavLink>
          </div>

          <div className="app-nav__group">
            <span className="app-nav__group-label">Связь</span>
            <NavLink to="/chats" className={linkClass}>
              Чаты
            </NavLink>
            <NavLink to="/notifications" className={linkClass}>
              <span className="app-nav__link-inner">
                Уведомления
                {unreadCount > 0 ? (
                  <span className="app-nav__badge" aria-label={`Не прочитано: ${unreadCount}`}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </span>
            </NavLink>
          </div>

          {me.role === "company" ? (
            <div className="app-nav__group">
              <span className="app-nav__group-label">Компания</span>
              <NavLink to="/talent" className={linkClass}>
                Исполнители
              </NavLink>
              <NavLink to="/shortlist" className={linkClass}>
                Избранное
              </NavLink>
              <NavLink to="/analytics/company" className={linkClass}>
                Аналитика
              </NavLink>
            </div>
          ) : null}

          <span className="app-nav__meta">
            {me.email} · {me.role}
          </span>
          <button type="button" onClick={logout} className="app-nav__btn">
            Выйти
          </button>
        </>
      ) : (
        <>
          <NavLink to="/feed" className={linkClass}>
            Объекты
          </NavLink>
          <NavLink to="/help" className={linkClass}>
            Помощь
          </NavLink>
          <span className="app-nav__spacer" aria-hidden />
          <NavLink to="/login" className={linkClass}>
            Вход
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => `app-nav__link app-nav__register${isActive ? " app-nav__link--active" : ""}`}
          >
            Регистрация
          </NavLink>
        </>
      )}
    </nav>
  );
}
