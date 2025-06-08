
'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode} from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoading) { 
      const isAuthPage = pathname === '/login';
      if (!user && !isAuthPage) {
        router.push('/login');
      } else if (user && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router, pathname]);

  if (authLoading) {
    return <FullScreenLoading />;
  }

  // En aquest punt, authLoading és false.
  // Si !user i no estem a /login, l'useEffect s'encarregarà de la redirecció.
  // Renderitzem els fills; DashboardLayout o altres components consumidors
  // gestionaran els seus propis estats de càrrega o usuaris nuls si cal.
  return (
    <AuthContext.Provider value={{ user, loading: authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const FullScreenLoading = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <LoadingSpinner size={48} />
  </div>
);
