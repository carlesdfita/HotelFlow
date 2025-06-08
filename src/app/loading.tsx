'use client';
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <LoadingSpinner size={48} />
      <p className="ml-4 text-lg text-foreground">Carregant...</p>
    </div>
  );
}
