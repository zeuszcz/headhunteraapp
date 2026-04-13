type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  function go(p: number) {
    const next = Math.min(Math.max(1, p), totalPages);
    if (next !== safePage) {
      onPageChange(next);
    }
  }

  if (total === 0) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Страницы результатов">
      <p className="pagination__summary">
        Показано {from}–{to} из {total}
        {totalPages > 1 ? ` · страница ${safePage} из ${totalPages}` : null}
      </p>
      {totalPages > 1 ? (
        <div className="pagination__controls">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            disabled={safePage <= 1}
            onClick={() => go(safePage - 1)}
          >
            Назад
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            disabled={safePage >= totalPages}
            onClick={() => go(safePage + 1)}
          >
            Вперёд
          </button>
        </div>
      ) : null}
    </nav>
  );
}
