'use client';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/layout/AppHeader';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!user) {
    // AuthProvider should handle redirect, but this is a safeguard
    return null; 
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppHeader />
      <main className="flex-1 overflow-y-auto p-4 pt-6 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
