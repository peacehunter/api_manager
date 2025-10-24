"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface User {
  [x: string]: string | null;
  id: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load from storage on mount
  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Persist on changes
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setUser({ id: data.user.id || data.user.email, email: data.user.email });
      } else {
        throw new Error(data.message || "Login failed.");
      }
    } catch (e: any) {
      setError(e.message || "Network error.");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.status === 201 && data.email) {
        // Optionally, login after register or redirect
        await login(email, password);
      } else {
        throw new Error(data.message || "Registration failed.");
      }
    } catch (e: any) {
      setError(e.message || "Network error.");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [login]);

 const logout = useCallback(() => {
    console.log("logout");
    setUser(null);
    setToken(null);
    setLoading(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  // Token/session check stub
  const checkSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error("No session");
      // Optionally, validate token with a ping to an authenticated endpoint
      const res = await fetch("/api/items", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.status === 401) {
        logout();
        throw new Error("Session expired");
      }
    } catch (e: any) {
      setError(e.message || "Session check failed.");
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}