import { Link } from "react-router-dom";

type EmptyStateProps = {
  title: string;
  description: string;
  primaryAction?: { to: string; label: string };
  secondaryAction?: { to: string; label: string };
};

export function EmptyState({ title, description, primaryAction, secondaryAction }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
          <path
            d="M18 30h20M28 20v20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__desc">{description}</p>
      {(primaryAction || secondaryAction) && (
        <div className="empty-state__actions">
          {primaryAction ? (
            <Link to={primaryAction.to} className="btn btn--primary">
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link to={secondaryAction.to} className="btn btn--ghost">
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
