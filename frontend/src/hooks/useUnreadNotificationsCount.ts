import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";
import { useAuth } from "../context/AuthContext";

/** Опрос счётчика непрочитанных уведомлений (для бейджа в навбаре и нижнем меню). */
export function useUnreadNotificationsCount(): number {
  const { me } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!me) {
      setCount(0);
      return;
    }
    let cancelled = false;
    async function poll() {
      try {
        const r = await apiFetch<{ count: number }>("/api/v1/notifications/unread-count");
        if (!cancelled) {
          setCount(r.count);
        }
      } catch {
        if (!cancelled) {
          setCount(0);
        }
      }
    }
    void poll();
    const id = window.setInterval(poll, 60000);
    function onFocus() {
      void poll();
    }
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [me?.id]);

  return count;
}
