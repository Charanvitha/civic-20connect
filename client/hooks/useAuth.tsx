import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  phone: string;
  token: string;
  aadhaarVerified?: boolean;
} | null;

const AuthCtx = createContext<{
  user: AuthUser;
  setUser: (u: AuthUser) => void;
}>({ user: null, setUser: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) setUser(JSON.parse(raw));
  }, []);
  useEffect(() => {
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    else localStorage.removeItem("auth:user");
  }, [user]);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
