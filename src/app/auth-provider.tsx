'use client';

import { createContext, useContext, useEffect, useMemo, useState, PropsWithChildren } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, User } from 'firebase/auth';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
      // Best-effort cookie sync for middleware if added later
      try {
        fetch('/api/auth/session', { method: 'POST', body: JSON.stringify({ isAuth: Boolean(u) }) });
      } catch {}
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signup: async (email: string, password: string, displayName?: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        try { await updateProfile(cred.user, { displayName }); } catch {}
      }
    },
    logout: async () => {
      await signOut(auth);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


