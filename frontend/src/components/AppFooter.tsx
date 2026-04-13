import { Link } from "react-router-dom";

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <span className="app-footer__brand">headhunteraapp</span>
        <div className="app-footer__links">
          <Link to="/">Главная</Link>
          <Link to="/feed">Объекты</Link>
          <span className="app-footer__muted">Поддержка: через профиль и чаты</span>
        </div>
      </div>
    </footer>
  );
}
