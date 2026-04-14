import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/http";
import { BrigadeCard } from "../components/BrigadeCard";
import { EmptyState } from "../components/EmptyState";
import { HelpHint } from "../components/HelpHint";
import { PageLayout } from "../components/PageLayout";
import { WorkerCard } from "../components/WorkerCard";
import { useAuth } from "../context/AuthContext";
import type { WorkObject } from "../types/workObject";
import { parseBrigadeProfile, parseWorkerProfile, type BrigadeProfile, type WorkerProfile } from "../types/profiles";

export function CompanyTalent() {
  const { me } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"workers" | "brigades">("workers");
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [brigades, setBrigades] = useState<BrigadeProfile[]>([]);
  const [mine, setMine] = useState<WorkObject[]>([]);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [chatObjectId, setChatObjectId] = useState("");
  const [listReady, setListReady] = useState(false);

  const loadWorkers = useCallback(async () => {
    setErr(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city.trim()) params.set("city", city.trim());
    const qs = params.toString();
    const path = `/api/v1/talent/workers${qs ? `?${qs}` : ""}`;
    const data = await apiFetch<Record<string, unknown>[]>(path);
    setWorkers(data.map((r) => parseWorkerProfile(r)));
  }, [q, city]);

  const loadBrigades = useCallback(async () => {
    setErr(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    const qs = params.toString();
    const path = `/api/v1/talent/brigades${qs ? `?${qs}` : ""}`;
    const data = await apiFetch<Record<string, unknown>[]>(path);
    setBrigades(data.map((r) => parseBrigadeProfile(r)));
  }, [q]);

  const loadMine = useCallback(async () => {
    const data = await apiFetch<WorkObject[]>("/api/v1/objects/company/mine");
    setMine(data);
  }, []);

  useEffect(() => {
    if (me?.role !== "company") return;
    void loadMine();
  }, [me?.role, loadMine]);

  useEffect(() => {
    if (mine.length > 0 && !chatObjectId) {
      setChatObjectId(mine[0].id);
    }
  }, [mine, chatObjectId]);

  useEffect(() => {
    if (me?.role !== "company") return;
    setListReady(false);
    if (tab === "workers") {
      void loadWorkers()
        .catch((e) => setErr(e instanceof Error ? e.message : "Ошибка"))
        .finally(() => setListReady(true));
    } else {
      void loadBrigades()
        .catch((e) => setErr(e instanceof Error ? e.message : "Ошибка"))
        .finally(() => setListReady(true));
    }
  }, [me?.role, tab, loadWorkers, loadBrigades]);

  async function addShortlist(id: string) {
    setErr(null);
    try {
      await apiFetch(`/api/v1/shortlist/${id}`, { method: "POST" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }

  async function openChat(peerId: string) {
    if (!chatObjectId) {
      setErr("Выберите объект для переписки или создайте объект в кабинете.");
      return;
    }
    setErr(null);
    try {
      const conv = await apiFetch<{ id: string }>("/api/v1/chat/conversations", {
        method: "POST",
        body: JSON.stringify({ work_object_id: chatObjectId, peer_user_id: peerId }),
      });
      nav(`/chats/${conv.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }

  if (me?.role !== "company") {
    return (
      <div className="card">
        <p className="muted">Раздел доступен только компаниям.</p>
        <Link to="/feed">К ленте объектов</Link>
      </div>
    );
  }

  const sidebar = (
    <>
      <h3>О разделе</h3>
      <p>
        Здесь каталог работников и бригад с рейтингом. Чтобы написать исполнителю, выберите свой объект — чат
        привязывается к задаче.
      </p>
      <p className="title-with-hint" style={{ marginBottom: 0 }}>
        <span>Избранное</span>
        <HelpHint title="Избранное и чат" label="Подсказка">
          <p>«В избранное» сохраняет карточку в раздел «Избранное».</p>
          <p>«Написать» создаёт переписку по выбранному объекту с выбранным исполнителем.</p>
        </HelpHint>
      </p>
    </>
  );

  return (
    <PageLayout
      title="Исполнители на рынке"
      subtitle="Каталог работников и бригад. Добавляйте в избранное и открывайте чат по выбранному объекту."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/talent", label: "Исполнители" },
      ]}
      actions={
        <Link to="/shortlist" className="btn btn--ghost">
          Избранное
        </Link>
      }
      sidebar={sidebar}
    >
      <div className="talent-object-bar card">
        <div className="talent-object-bar__row">
          <label className="talent-object-bar__field">
            <span className="talent-object-bar__label">Объект для переписки</span>
            <select
              className="input-select"
              value={chatObjectId}
              onChange={(e) => setChatObjectId(e.target.value)}
              aria-label="Объект для переписки"
            >
              <option value="">Выберите объект…</option>
              {mine.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title} ({o.status})
                </option>
              ))}
            </select>
          </label>
          <Link to="/objects/new" className="btn btn--secondary talent-object-bar__create">
            Новый объект
          </Link>
        </div>
        <p className="talent-object-bar__hint muted">Переписка создаётся в контексте выбранной задачи. Если списка нет — создайте объект.</p>
      </div>

      <div className="talent-toolbar card">
        <div className="talent-toolbar__tabs" role="tablist" aria-label="Тип исполнителей">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "workers"}
            className={`btn btn--sm ${tab === "workers" ? "btn--primary" : "btn--secondary"}`}
            onClick={() => setTab("workers")}
          >
            Работники
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "brigades"}
            className={`btn btn--sm ${tab === "brigades" ? "btn--primary" : "btn--secondary"}`}
            onClick={() => setTab("brigades")}
          >
            Бригады
          </button>
        </div>
        <div className="talent-toolbar__search">
          <input
            className="talent-toolbar__input"
            placeholder="Поиск по профилю"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Поиск"
          />
          {tab === "workers" ? (
            <input
              className="talent-toolbar__input talent-toolbar__input--city"
              placeholder="Город"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="Город"
            />
          ) : null}
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => (tab === "workers" ? void loadWorkers() : void loadBrigades())}
          >
            Найти
          </button>
        </div>
      </div>

      {err ? <p className="form-error">{err}</p> : null}

      {tab === "workers" ? (
        !listReady ? (
          <p className="muted">Загрузка…</p>
        ) : workers.length === 0 ? (
          <EmptyState
            title="Нет работников по запросу"
            description="Попробуйте другой город или сократите поисковую строку."
            primaryAction={{ to: "/talent", label: "Обновить раздел" }}
            secondaryAction={{ to: "/feed", label: "Лента объектов" }}
          />
        ) : (
          <ul className="feed-list">
            {workers.map((w) => (
              <li key={w.user_id} className="feed-card">
                <WorkerCard
                  worker={w}
                  actions={
                    <>
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => void addShortlist(w.user_id)}>
                        В избранное
                      </button>
                      <button type="button" className="btn btn--primary btn--sm" onClick={() => void openChat(w.user_id)}>
                        Написать
                      </button>
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        )
      ) : !listReady ? (
        <p className="muted">Загрузка…</p>
      ) : brigades.length === 0 ? (
        <EmptyState
          title="Нет бригад по запросу"
          description="Измените поисковый запрос или вернитесь позже."
          primaryAction={{ to: "/talent", label: "Обновить раздел" }}
          secondaryAction={{ to: "/objects/new", label: "Новый объект" }}
        />
      ) : (
        <ul className="feed-list">
          {brigades.map((b) => (
            <li key={b.user_id} className="feed-card">
              <BrigadeCard
                brigade={b}
                actions={
                  <>
                    <button type="button" className="btn btn--secondary btn--sm" onClick={() => void addShortlist(b.user_id)}>
                      В избранное
                    </button>
                    <button type="button" className="btn btn--primary btn--sm" onClick={() => void openChat(b.user_id)}>
                      Написать
                    </button>
                  </>
                }
              />
            </li>
          ))}
        </ul>
      )}
    </PageLayout>
  );
}
