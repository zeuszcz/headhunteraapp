const TOKEN_KEY = "headhunteraapp_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function formatApiError(data: unknown, statusText: string): string {
  if (typeof data !== "object" || data === null || !("detail" in data)) {
    return statusText;
  }
  const raw = (data as { detail: unknown }).detail;
  if (typeof raw === "string") {
    return raw;
  }
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === "object" && item !== null && "msg" in item) {
          return String((item as { msg: unknown }).msg);
        }
        return JSON.stringify(item);
      })
      .join("; ");
  }
  return String(raw);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth !== false) {
    const t = getToken();
    if (t) {
      headers.set("Authorization", `Bearer ${t}`);
    }
  }
  const res = await fetch(path, { ...options, headers });
  if (res.status === 204) {
    return undefined as T;
  }
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    throw new Error(formatApiError(data, res.statusText));
  }
  return data as T;
}
