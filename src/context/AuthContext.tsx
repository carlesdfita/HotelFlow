
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
  const [authLoading, setAuthLoading] = useState(true); // Renamed to avoid conflict
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
    if (!authLoading) { // Only act once auth state is resolved
      const isAuthPage = pathname === '/login';
      if (!user && !isAuthPage) {
        router.push('/login');
      } else if (user && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router, pathname]);

  // If initial auth state is still loading, show full screen spinner
  if (authLoading) {
    return <FullScreenLoading />;
  }

  // If auth is resolved, but no user and not on login page,
  // useEffect will redirect. Show spinner during this brief period.
  if (!user && pathname !== '/login') {
    return <FullScreenLoading />;
  }

  // Otherwise, auth is resolved, and we can render children.
  // (Either user exists, or we are on /login page)
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
