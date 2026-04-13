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
      <div className="card filters-panel" style={{ marginBottom: "1rem" }}>
        <label>
          Объект для переписки
          <select
            value={chatObjectId}
            onChange={(e) => setChatObjectId(e.target.value)}
            style={{ marginTop: 6, width: "100%", maxWidth: 420 }}
          >
            <option value="">— выберите —</option>
            {mine.map((o) => (
              <option key={o.id} value={o.id}>
                {o.title} ({o.status})
              </option>
            ))}
          </select>
        </label>
        <p className="muted" style={{ fontSize: "0.85rem", margin: 0 }}>
          Нет объектов?{" "}
          <Link to="/objects/new">Создать</Link>
        </p>
      </div>

      <div className="flex-gap" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={`btn ${tab === "workers" ? "btn--primary" : "btn--secondary"}`}
          onClick={() => setTab("workers")}
        >
          Работники
        </button>
        <button
          type="button"
          className={`btn ${tab === "brigades" ? "btn--primary" : "btn--secondary"}`}
          onClick={() => setTab("brigades")}
        >
          Бригады
        </button>
      </div>

      {tab === "workers" ? (
        <div className="filters-panel card">
          <input placeholder="Поиск" value={q} onChange={(e) => setQ(e.target.value)} />
          <input placeholder="Город" value={city} onChange={(e) => setCity(e.target.value)} />
          <button type="button" className="btn btn--primary" onClick={() => void loadWorkers()}>
            Найти
          </button>
        </div>
      ) : (
        <div className="filters-panel card">
          <input placeholder="Поиск" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" className="btn btn--primary" onClick={() => void loadBrigades()}>
            Найти
          </button>
        </div>
      )}

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
