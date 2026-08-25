"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCustomer, type Customer } from "@/lib/api/order";

interface AuthContextValue {
  token: string | null;
  customer: Customer | null;
  hydrated: boolean;
  isLoggedIn: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "mathsya-auth-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const clearSession = useCallback(() => {
    setToken(null);
    setCustomer(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const fetchedCustomer = await getCustomer(stored);
          setToken(stored);
          setCustomer(fetchedCustomer);
        }
      } catch {
        clearSession();
      }
      setHydrated(true);
    })();
  }, [clearSession]);

  const login = useCallback(async (newToken: string) => {
    const fetchedCustomer = await getCustomer(newToken);
    setToken(newToken);
    setCustomer(fetchedCustomer);
    try {
      localStorage.setItem(STORAGE_KEY, newToken);
    } catch {}
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const refreshCustomer = useCallback(async () => {
    if (!token) return;
    const fetchedCustomer = await getCustomer(token);
    setCustomer(fetchedCustomer);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        customer,
        hydrated,
        isLoggedIn: !!token,
        login,
        logout,
        refreshCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
