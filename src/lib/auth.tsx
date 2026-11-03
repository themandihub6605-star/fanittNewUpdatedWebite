// File: src/lib/auth.tsx  (fanitt-website)
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { readSession, writeSession, type Session } from './api';

type AuthValue = { session: Session | null; logout: () => void };

const AuthContext = createContext<AuthValue>({ session: null, logout: () => {} });

/** Who is logged in on the website (kept in this browser). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession());

  useEffect(() => {
    const sync = () => setSession(readSession());
    window.addEventListener('fanitt:session', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('fanitt:session', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return <AuthContext.Provider value={{ session, logout: () => writeSession(null) }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);