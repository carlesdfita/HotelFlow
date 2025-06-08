import ConfigManager from '@/components/config/ConfigManager';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ConfigPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold font-headline text-primary">Configuració</h2>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tornar a Incidències
          </Link>
        </Button>
      </div>
      <ConfigManager />
    </div>
  );
}
