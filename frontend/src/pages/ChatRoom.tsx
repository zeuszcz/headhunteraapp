import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/http";
import { EmptyState } from "../components/EmptyState";
import { PageLayout } from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";

type Message = {
  id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
};

type ConversationMeta = {
  id: string;
  work_object_title?: string | null;
  peer_display_name?: string | null;
  peer_role?: string | null;
};

export function ChatRoom() {
  const { id } = useParams<{ id: string }>();
  const { me } = useAuth();
  const [meta, setMeta] = useState<ConversationMeta | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    void apiFetch<ConversationMeta>(`/api/v1/chat/conversations/${id}`)
      .then(setMeta)
      .catch(() => setMeta(null));
  }, [id]);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setErr(null);
    try {
      const data = await apiFetch<Message[]>(`/api/v1/chat/conversations/${id}/messages`);
      setMessages(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }, [id]);

  useEffect(() => {
    void load().finally(() => {
      if (!initialLoadDone.current) {
        initialLoadDone.current = true;
        setReady(true);
      }
    });
    const t = setInterval(() => void load(), 5000);
    return () => clearInterval(t);
  }, [load]);

  async function send() {
    if (!id || !body.trim()) {
      return;
    }
    setErr(null);
    try {
      await apiFetch(`/api/v1/chat/conversations/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ body: body.trim() }),
      });
      setBody("");
      void load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }

  const peerTitle = meta?.peer_display_name?.trim() || "Переписка";
  const objectSubtitle = meta?.work_object_title?.trim();

  return (
    <PageLayout
      title={peerTitle}
      subtitle={
        objectSubtitle ? (
          <span className="muted">{objectSubtitle}</span>
        ) : (
          <span className="muted">Диалог по объекту</span>
        )
      }
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { to: "/chats", label: "Чаты" },
        { to: id ? `/chats/${id}` : "/chats", label: peerTitle },
      ]}
    >
      <p>
        <Link to="/chats" className="back-link" style={{ marginBottom: 0 }}>
          ← К списку чатов
        </Link>
      </p>
      {err ? <p className="form-error">{err}</p> : null}
      {!ready ? (
        <p className="muted">Загрузка…</p>
      ) : messages.length === 0 && !err ? (
        <EmptyState
          title="Пока нет сообщений"
          description="Напишите первое сообщение по объекту — оно появится здесь."
          primaryAction={{ to: "/feed", label: "Лента объектов" }}
        />
      ) : messages.length > 0 ? (
        <div className="chat-panel">
          {messages.map((m) => {
            const fromSelf = me && m.sender_user_id === me.id;
            const fromLabel = fromSelf ? "Вы" : meta?.peer_display_name?.trim() || "Собеседник";
            return (
              <div key={m.id} className="chat-row">
                <div className="chat-row__from">{fromLabel}</div>
                <div className="chat-row__body">{m.body}</div>
              </div>
            );
          })}
        </div>
      ) : null}
      <div className="chat-input-row" style={{ marginTop: "0.85rem" }}>
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Сообщение" />
        <button type="button" className="btn btn--primary" onClick={() => void send()}>
          Отправить
        </button>
      </div>
    </PageLayout>
  );
}
