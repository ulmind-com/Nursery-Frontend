import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi } from "@/api/services";
import { tokenStore } from "@/lib/token";
import type { AuthResponse, User } from "@/types/api";

interface AuthContextValue { user: User | null; token: string | null; isAuthenticated: boolean; loading: boolean; acceptAuth: (response: AuthResponse) => void; refreshUser: () => Promise<void>; logout: () => void }
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [token, setToken] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  const logout = useCallback(() => { tokenStore.clear(); setToken(null); setUser(null); }, []);
  const refreshUser = useCallback(async () => { const stored = tokenStore.get(); if (!stored) { setLoading(false); return; } try { setToken(stored); setUser(await authApi.me()); } catch { logout(); } finally { setLoading(false); } }, [logout]);
  useEffect(() => { void refreshUser(); }, [refreshUser]);
  const acceptAuth = useCallback((response: AuthResponse) => { tokenStore.set(response.access_token); setToken(response.access_token); setUser(response.user); }, []);
  const value = useMemo(() => ({ user, token, isAuthenticated: Boolean(user && token), loading, acceptAuth, refreshUser, logout }), [user, token, loading, acceptAuth, refreshUser, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used inside AuthProvider"); return context; }
