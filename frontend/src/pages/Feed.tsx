import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/http";
import { EmptyState } from "../components/EmptyState";
import { FeedObjectCard } from "../components/FeedObjectCard";
import { HelpHint } from "../components/HelpHint";
import { PageLayout } from "../components/PageLayout";
import { Pagination } from "../components/Pagination";
import {
  loadFeedPresets,
  removeFeedPreset,
  saveFeedPreset,
  type FeedPreset,
} from "../lib/feedPresets";
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
  const sortParam = searchParams.get("sort") === "old" ? "old" : "new";

  const [draftCity, setDraftCity] = useState(city);
  const [draftQ, setDraftQ] = useState(q);
  const [draftPayment, setDraftPayment] = useState(payment);

  const [items, setItems] = useState<WorkObject[]>([]);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [presets, setPresets] = useState<FeedPreset[]>(() => loadFeedPresets());
  const [presetName, setPresetName] = useState("");

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
    if (sortParam === "old") {
      params.set("sort", "old");
    }
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
  }, [city, q, payment, page, sortParam]);

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
    if (sortParam === "old") {
      next.set("sort", "old");
    }
    setSearchParams(next);
  }

  function goToPage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  }

  function setSort(nextSort: "new" | "old") {
    const next = new URLSearchParams(searchParams);
    next.set("page", "1");
    if (nextSort === "old") {
      next.set("sort", "old");
    } else {
      next.delete("sort");
    }
    setSearchParams(next);
  }

  function applyPreset(p: FeedPreset) {
    const next = new URLSearchParams();
    if (p.city.trim()) {
      next.set("city", p.city.trim());
    }
    if (p.q.trim()) {
      next.set("q", p.q.trim());
    }
    if (p.payment.trim()) {
      next.set("payment", p.payment.trim());
    }
    next.set("page", "1");
    if (sortParam === "old") {
      next.set("sort", "old");
    }
    setSearchParams(next);
  }

  function onSavePreset() {
    const name = presetName.trim() || "Мой фильтр";
    setPresets(saveFeedPreset(name, draftCity, draftQ, draftPayment));
    setPresetName("");
  }

  function onRemovePreset(id: string) {
    setPresets(removeFeedPreset(id));
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
      subtitle="Лента карточек: фильтры и сортировка ниже, по 12 на странице."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/feed", label: "Объекты" },
      ]}
      sidebar={sidebar}
    >
      <div className="feed-controls card">
        <div className="feed-controls__main">
          <div className="feed-controls__fields">
            <input
              className="feed-controls__input"
              placeholder="Город / регион"
              value={draftCity}
              onChange={(e) => setDraftCity(e.target.value)}
              aria-label="Город"
            />
            <input
              className="feed-controls__input"
              placeholder="Поиск: название, описание, навыки"
              value={draftQ}
              onChange={(e) => setDraftQ(e.target.value)}
              aria-label="Поиск"
            />
            <input
              className="feed-controls__input"
              placeholder="Оплата (подстрока)"
              value={draftPayment}
              onChange={(e) => setDraftPayment(e.target.value)}
              aria-label="Оплата"
            />
          </div>
          <div className="feed-controls__actions">
            <label className="feed-controls__sort">
              <span className="feed-controls__sort-label">Порядок</span>
              <select
                className="input-select input-select--sm"
                value={sortParam}
                onChange={(e) => setSort(e.target.value === "old" ? "old" : "new")}
                aria-label="Сортировка по дате"
              >
                <option value="new">Сначала новые</option>
                <option value="old">Сначала старые</option>
              </select>
            </label>
            <button type="button" className="btn btn--primary btn--sm" onClick={applyFilters}>
              Применить
            </button>
            <span className="title-with-hint feed-controls__hint">
              <HelpHint title="Как устроены фильтры" label="Фильтры">
                <p>Все поля необязательны. «Применить» отправляет запрос с учётом сортировки.</p>
              </HelpHint>
            </span>
          </div>
        </div>
        <details className="feed-presets-details">
          <summary className="feed-presets-details__summary">
            Сохранённые фильтры
            {presets.length > 0 ? <span className="feed-presets-details__count">{presets.length}</span> : null}
          </summary>
          <div className="feed-presets-details__body">
            <div className="feed-presets__row">
              <input
                placeholder="Название набора"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                aria-label="Название сохранённого фильтра"
              />
              <button type="button" className="btn btn--secondary btn--sm" onClick={onSavePreset}>
                Сохранить набор
              </button>
            </div>
            {presets.length > 0 ? (
              <ul className="feed-presets__list">
                {presets.map((p) => (
                  <li key={p.id}>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => applyPreset(p)}>
                      {p.name}
                    </button>
                    <button
                      type="button"
                      className="btn btn--sm feed-presets__remove"
                      onClick={() => onRemovePreset(p.id)}
                      aria-label={`Удалить ${p.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted feed-presets-details__empty">Нет сохранённых — задайте поля выше и нажмите «Сохранить набор».</p>
            )}
          </div>
        </details>
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
