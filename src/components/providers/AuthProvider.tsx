'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  avatar: string | null;
  image: string | null;
  emailVerified: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch('/api/user/profile', {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const user = data?.data?.user;
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      role: user.role,
      avatar: user.avatar ?? null,
      image: user.avatar ?? null,
      emailVerified: user.emailVerified ?? null,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);
    const nextUser = await fetchCurrentUser();
    setUser(nextUser);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, refresh, logout }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
