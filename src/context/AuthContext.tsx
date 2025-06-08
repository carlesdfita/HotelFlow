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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === '/login';
      if (!user && !isAuthPage) {
        router.push('/login');
      } else if (user && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    // For initial load or when auth state is changing on non-auth pages
    const isAuthPage = pathname === '/login';
    if (!isAuthPage) {
        return <FullScreenLoading />;
    }
  }
  
  // Allow rendering login page even when loading to avoid flicker
  if (pathname === '/login' && (loading || !user)) {
    return (
      <AuthContext.Provider value={{ user, loading }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // For protected routes, if still loading and no user, show full screen loader
  if (loading && !user && pathname !== '/login') {
     return <FullScreenLoading />;
  }
  
  // If not loading and no user on a protected route, redirect is handled by above useEffect.
  // This prevents rendering children of protected routes prematurely.
  if (!loading && !user && pathname !== '/login') {
    return <FullScreenLoading />; // Or null, as redirect will occur.
  }


  return (
    <AuthContext.Provider value={{ user, loading }}>
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
