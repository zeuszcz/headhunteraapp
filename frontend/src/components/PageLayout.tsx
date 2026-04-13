import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type PageLayoutProps = {
  title: string;
  subtitle?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
};

export function PageLayout({ title, subtitle, breadcrumbs, actions, sidebar, children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      {breadcrumbs && breadcrumbs.length > 0 ? <Breadcrumbs items={breadcrumbs} /> : null}
      <header className="page-layout__header">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle ? <p className="page-lead" style={{ marginBottom: 0 }}>{subtitle}</p> : null}
        </div>
        {actions ? <div className="page-layout__actions">{actions}</div> : null}
      </header>
      <div className={`page-layout__grid ${sidebar ? "page-layout__grid--with-sidebar" : ""}`}>
        <div className="page-layout__main">{children}</div>
        {sidebar ? <aside className="page-layout__sidebar">{sidebar}</aside> : null}
      </div>
    </div>
  );
}
