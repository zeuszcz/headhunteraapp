import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/http";
import { EmptyState } from "../components/EmptyState";
import { FeedObjectCard } from "../components/FeedObjectCard";
import { HelpHint } from "../components/HelpHint";
import { PageLayout } from "../components/PageLayout";
import { Pagination } from "../components/Pagination";
import type { WorkObject } from "../types/workObject";

export type { WorkObject } from "../types/workObject";

const PAGE_SIZE = 12;

type ListResponse = { items: WorkObject[]; total: number };

export function Feed() {
  const [searchParams, setSearchParams] = useSearchParams();

  const city = searchParams.get("city") ?? "";
  const q = searchParams.get("q") ?? "";
  const payment = searchParams.get("payment") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const [draftCity, setDraftCity] = useState(city);
  const [draftQ, setDraftQ] = useState(q);
  const [draftPayment, setDraftPayment] = useState(payment);

  const [items, setItems] = useState<WorkObject[]>([]);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDraftCity(city);
    setDraftQ(q);
    setDraftPayment(payment);
  }, [city, q, payment]);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    const params = new URLSearchParams();
    if (city.trim()) {
      params.set("city", city.trim());
    }
    if (q.trim()) {
      params.set("q", q.trim());
    }
    if (payment.trim()) {
      params.set("payment", payment.trim());
    }
    const limit = PAGE_SIZE;
    const offset = (page - 1) * limit;
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    const qs = params.toString();
    const path = `/api/v1/objects?${qs}`;
    try {
      const data = await apiFetch<ListResponse>(path, { auth: false });
      setItems(data.items);
      setTotal(data.total);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [city, q, payment, page]);

  useEffect(() => {
    void load();
  }, [load]);

  function applyFilters() {
    const next = new URLSearchParams();
    if (draftCity.trim()) {
      next.set("city", draftCity.trim());
    }
    if (draftQ.trim()) {
      next.set("q", draftQ.trim());
    }
    if (draftPayment.trim()) {
      next.set("payment", draftPayment.trim());
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  function goToPage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  }

  const sidebar = (
    <>
      <h3>Советы по фильтрам</h3>
      <p>
        Укажите город или регион, чтобы сузить выдачу. Поле «Поиск» ищет по названию, описанию и навыкам.
      </p>
      <p>
        Подстрока в «Оплате» помогает найти формулировки вроде «за смену» или «договорная».
      </p>
      <p className="title-with-hint" style={{ marginBottom: 0 }}>
        <span>Статусы в ленте</span>
        <HelpHint title="Статусы объектов" label="Справка по статусам в ленте">
          <p>В ленте попадают опубликованные карточки. В кабинете компании можно черновики и смену статуса.</p>
          <p>Откройте карточку, чтобы увидеть полное описание и откликнуться.</p>
        </HelpHint>
      </p>
    </>
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  return (
    <PageLayout
      title="Объекты и задачи"
      subtitle="Фильтры: город, поиск по тексту, подстрока в оплате. Страницы по 12 карточек."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/feed", label: "Объекты" },
      ]}
      sidebar={sidebar}
    >
      <div className="card filters-panel filters-panel--wide">
        <div className="title-with-hint" style={{ gridColumn: "1 / -1" }}>
          <span>Фильтры</span>
          <HelpHint title="Как устроены фильтры" label="Подсказка по фильтрам">
            <p>Все поля необязательны: можно искать только по городу или только по ключевым словам.</p>
            <p>Нажмите «Применить», чтобы перезапросить список с сервера.</p>
          </HelpHint>
        </div>
        <input
          placeholder="Город / регион"
          value={draftCity}
          onChange={(e) => setDraftCity(e.target.value)}
          aria-label="Город"
        />
        <input
          placeholder="Поиск (название, описание, навыки)"
          value={draftQ}
          onChange={(e) => setDraftQ(e.target.value)}
          aria-label="Поиск"
        />
        <input
          placeholder="Оплата (подстрока)"
          value={draftPayment}
          onChange={(e) => setDraftPayment(e.target.value)}
          aria-label="Оплата"
        />
        <button type="button" className="btn btn--primary" style={{ justifySelf: "start" }} onClick={applyFilters}>
          Применить фильтры
        </button>
      </div>

      {err ? (
        <p className="form-error">
          {err}{" "}
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => void load()}>
            Повторить
          </button>
        </p>
      ) : null}

      {!loading && !err ? (
        <p className="feed-meta-line muted" style={{ marginBottom: "1rem", fontSize: "0.92rem" }}>
          Найдено объектов: {total}
          {total > 0 ? ` · страница ${safePage} из ${totalPages}` : null}
        </p>
      ) : null}

      {loading ? (
        <div className="feed-grid feed-grid--loading" aria-busy="true" aria-label="Загрузка списка">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="feed-card feed-card--skeleton card">
              <div className="skeleton-line skeleton-line--title" style={{ width: "70%" }} />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          ))}
        </div>
      ) : items.length === 0 && !err ? (
        <EmptyState
          title="Нет объявлений по фильтру"
          description="Очистите поля фильтров и нажмите «Применить» — или измените город и ключевые слова."
          primaryAction={{ to: "/", label: "На главную" }}
        />
      ) : !err ? (
        <>
          <ul className="feed-grid">
            {items.map((o) => (
              <li key={o.id} className="feed-card">
                <FeedObjectCard object={o} />
              </li>
            ))}
          </ul>
          <Pagination page={safePage} pageSize={PAGE_SIZE} total={total} onPageChange={goToPage} />
        </>
      ) : null}
    </PageLayout>
  );
}
