import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, getToken, setToken } from "../api/http";

export type UserRole = "company" | "worker" | "brigade";

export type Me = {
  id: string;
  email: string;
  role: UserRole;
  profile: Record<string, unknown>;
  organization_id?: string | null;
  is_platform_admin?: boolean;
};

type AuthState = {
  me: Me | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    if (!getToken()) {
      setMe(null);
      setLoading(false);
      return;
    }
    try {
      const data = await apiFetch<Me>("/api/v1/auth/me");
      setMe(data);
    } catch {
      setToken(null);
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<{ access_token: string }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      auth: false,
    });
    setToken(res.access_token);
    await refresh();
  }, [refresh]);

  const register = useCallback(
    async (email: string, password: string, role: UserRole) => {
      const res = await apiFetch<{ access_token: string }>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
        auth: false,
      });
      setToken(res.access_token);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(() => {
    setToken(null);
    setMe(null);
  }, []);

  const value = useMemo(
    () => ({ me, loading, refresh, login, register, logout }),
    [me, loading, refresh, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth outside provider");
  }
  return ctx;
}
