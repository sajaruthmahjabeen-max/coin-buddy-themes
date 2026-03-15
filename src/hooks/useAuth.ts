import { useState, useEffect, useCallback } from "react";
import { getCurrentUser, login as doLogin, signup as doSignup, logout as doLogout, User } from "@/lib/store";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const result = doLogin(email, password);
    if (typeof result === "string") return result;
    setUser(result);
    return null;
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    const result = doSignup(name, email, password);
    if (typeof result === "string") return result;
    setUser(result);
    localStorage.setItem("coinbuddy_current_user", JSON.stringify(result));
    return null;
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setUser(null);
  }, []);

  return { user, loading, login, signup, logout };
}
