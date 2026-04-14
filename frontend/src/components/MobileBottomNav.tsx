import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `mobile-nav__link${isActive ? " mobile-nav__link--active" : ""}`;

type Props = {
  unreadCount: number;
};

export function MobileBottomNav({ unreadCount }: Props) {
  const { me } = useAuth();
  if (!me) return null;

  return (
    <nav className="mobile-bottom-nav" aria-label="Быстрая навигация">
      <NavLink to="/feed" className={linkClass} end>
        Лента
      </NavLink>
      <NavLink to="/dashboard" className={linkClass}>
        Кабинет
      </NavLink>
      <NavLink to="/chats" className={linkClass}>
        Чаты
      </NavLink>
      <NavLink to="/notifications" className={linkClass}>
        <span className="mobile-nav__label">Уведомл.</span>
        {unreadCount > 0 ? (
          <span className="mobile-nav__badge" aria-label={`Не прочитано: ${unreadCount}`}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        Профиль
      </NavLink>
    </nav>
  );
}
