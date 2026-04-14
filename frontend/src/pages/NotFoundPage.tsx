import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";

export function NotFoundPage() {
  return (
    <div className="not-found-wrap">
      <EmptyState
        title="Страница не найдена"
        description="Проверьте адрес или перейдите на главную или в ленту объектов."
        primaryAction={{ to: "/feed", label: "К объектам" }}
      />
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        <Link to="/">На главную</Link>
      </p>
    </div>
  );
}
