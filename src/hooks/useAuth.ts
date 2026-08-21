import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "@/api/hooks/auth.hooks";
import { UserDetail } from "@/api/hooks/user.hooks";

export type AuthUser = (UserProfile & Partial<UserDetail>) | UserDetail;

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_token") || localStorage.getItem("token") || null;
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const checkIsAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const syncAuth = useCallback(() => {
    const currentToken = getAuthToken();
    const currentUser = getStoredUser();
    setToken(currentToken);
    setUser(currentUser);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    syncAuth();

    const handleStorageChange = () => {
      syncAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, [syncAuth]);

  const login = useCallback((newToken: string, newUser?: AuthUser) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("user_token", newToken);
    localStorage.setItem("token", newToken);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    }
    window.dispatchEvent(new Event("auth-change"));
    syncAuth();
  }, [syncAuth]);

  const logout = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("user_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    window.dispatchEvent(new Event("auth-change"));
    syncAuth();
  }, [syncAuth]);

  return {
    isAuthenticated: !!token,
    token,
    user,
    isLoaded,
    checkAuth: checkIsAuthenticated,
    login,
    logout,
    syncAuth,
  };
}

export default useAuth;
