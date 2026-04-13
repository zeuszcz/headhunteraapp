import { Link } from "react-router-dom";

export type Crumb = { label: string; to?: string };

type BreadcrumbsProps = {
  items: Crumb[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;
  return (
    <nav className="breadcrumbs" aria-label="Навигация по разделу">
      <ol className="breadcrumbs__list">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="breadcrumbs__item">
              {!isLast ? (
                <>
                  {c.to ? (
                    <Link to={c.to} className="breadcrumbs__link">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="breadcrumbs__muted">{c.label}</span>
                  )}
                  <span className="breadcrumbs__sep" aria-hidden>
                    /
                  </span>
                </>
              ) : (
                <span className="breadcrumbs__current">{c.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
