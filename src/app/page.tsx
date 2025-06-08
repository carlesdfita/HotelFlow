'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen min-h-screen w-full flex-col items-center justify-center bg-background">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-lg text-foreground">Carregant HotelFlow...</p>
    </div>
  );
}
